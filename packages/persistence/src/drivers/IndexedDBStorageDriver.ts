import { createBlob } from '../common/createBlob';
import { Defer } from '../common/Defer';
import {
    StorageDriver,
    StorageDriverChangeEventListener
} from '../core/driver/StorageDriver';
import { StorageDriverOptions } from '../core/driver/StorageDriverOptions';
import { deleteDB, IDBPDatabase, openDB } from 'idb';
import { ActionType } from '../types/ActionType';
import { ChangeBy } from '../types/ChangeBy';

const STORE_NAME = 'keyval';

export class IndexedDBStorageDriver implements StorageDriver {
    readonly name: string = 'IndexedDBStorageDriver';
    private readonly observers = new Map<
        string,
        StorageDriverChangeEventListener[]
    >();
    private bucketName: string;
    private version?: number;
    private idbDefer = new Defer<IDBPDatabase>();
    private get idbPromise() {
        return this.idbDefer.promise;
    }
    constructor(options: StorageDriverOptions) {
        this.bucketName = options.bucketName;
        this.version = options.version;
    }
    async prepare(): Promise<void> {
        const idb = await openDB(this.bucketName, this.version, {
            upgrade(db) {
                db.createObjectStore(STORE_NAME);
            }
        });
        this.idbDefer.resolve(idb);
    }
    async supports(): Promise<boolean> {
        try {
            const checkDBName = '_vgerbot_check_idb';
            await openDB(checkDBName);
            await deleteDB(checkDBName);
            return true;
        } catch (error) {
            return false;
        }
    }
    async getItem(key: string): Promise<undefined | Blob> {
        const db = await this.idbPromise;
        const value: undefined | Uint8Array = await db.get(
            STORE_NAME,
            IDBKeyRange.only(key)
        );
        if (!value) {
            return;
        }
        return createBlob([value], {});
    }
    async removeItem(key: string): Promise<void> {
        const db = await this.idbPromise;
        const needDispatch = this.needDispatch(key);
        const oldValue = needDispatch ? await this.getItem(key) : undefined;
        await db.delete(STORE_NAME, IDBKeyRange.only(key));
        if (needDispatch) {
            this.dispatchChangeEvent(
                key,
                ActionType.REMOVE,
                undefined,
                oldValue
            );
        }
    }
    async setItem(key: string, value: Blob): Promise<void> {
        const db = await this.idbPromise;
        const buffer = await value.arrayBuffer();
        const needDispatch = this.needDispatch(key);
        const oldValue = needDispatch ? await this.getItem(key) : undefined;
        await db.put(STORE_NAME, buffer, IDBKeyRange.only(key));
        if (needDispatch) {
            this.dispatchChangeEvent(key, ActionType.UPDATE, value, oldValue);
        }
    }
    async clear(): Promise<void> {
        const db = await this.idbPromise;
        await db.clear(STORE_NAME);
    }
    observe(
        key: string,
        onChange: StorageDriverChangeEventListener
    ): () => void {
        const changeListener = onChange.bind(this);
        const listeners = this.observers.get(key) || [];
        listeners.push(changeListener);
        this.observers.set(key, listeners);

        return () => {
            const index = listeners.indexOf(changeListener);
            if (index === -1) {
                return;
            }
            listeners.splice(index, 1);
        };
    }
    private dispatchChangeEvent(
        key: string,
        action: ActionType,
        newValue?: Blob,
        originValue?: Blob
    ) {
        const listeners = this.observers.get(key);
        if (!listeners || listeners.length === 0) {
            return;
        }
        listeners.forEach(listener => {
            listener({
                target: this,
                key,
                action,
                newValue,
                originValue,
                changeBy: ChangeBy.SELF
            });
        });
    }
    private needDispatch(key: string) {
        return !!this.observers.get(key)?.length;
    }
}
