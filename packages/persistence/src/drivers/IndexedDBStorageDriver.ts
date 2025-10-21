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

/**
 * Storage driver implementation that uses the browser's IndexedDB API.
 * Provides larger storage capacity and more advanced features compared to Web Storage.
 * Data persists across browser sessions and supports versioning for schema migrations.
 *
 * @public
 */
export class IndexedDBStorageDriver implements StorageDriver {
    /**
     * The name identifier for this driver.
     */
    readonly name: string = 'IndexedDBStorageDriver';
    private readonly observers = new Map<
        string,
        StorageDriverChangeEventListener[]
    >();
    private readonly bucketName: string;
    private readonly version?: number;
    private idbDefer = new Defer<IDBPDatabase>();
    private get idbPromise() {
        return this.idbDefer.promise;
    }
    /**
     * Creates a new IndexedDBStorageDriver instance.
     *
     * @param options - Configuration options including bucket name and version
     */
    constructor(options: StorageDriverOptions) {
        this.bucketName = options.bucketName;
        this.version = options.version;
    }
    /**
     * Prepares the driver by opening the IndexedDB database and creating the object store.
     *
     * @returns A promise that resolves when the database is ready
     */
    async prepare(): Promise<void> {
        const idb = await openDB(this.bucketName, this.version, {
            upgrade(db) {
                db.createObjectStore(STORE_NAME);
            }
        });
        this.idbDefer.resolve(idb);
    }
    /**
     * Checks if IndexedDB is supported in the current environment.
     *
     * @returns A promise that resolves to true if IndexedDB is supported, false otherwise
     */
    async supports(): Promise<boolean> {
        try {
            if (typeof indexedDB === 'undefined') {
                return false;
            }
            const checkDBName = '_vgerbot_check_idb';
            const db = await openDB(checkDBName);
            await db.close();
            await deleteDB(checkDBName);
            return true;
        } catch {
            return false;
        }
    }
    /**
     * Retrieves an item from IndexedDB by key.
     *
     * @param key - The key of the item to retrieve
     * @returns A promise that resolves to the stored Blob, or undefined if not found
     */
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
    /**
     * Removes an item from IndexedDB by key.
     *
     * @param key - The key of the item to remove
     * @returns A promise that resolves when the item is removed
     */
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
    /**
     * Stores an item in IndexedDB.
     *
     * @param key - The key to store the item under
     * @param value - The Blob value to store
     * @returns A promise that resolves when the item is stored
     */
    async setItem(key: string, value: Blob): Promise<void> {
        const db = await this.idbPromise;
        const buffer = await value.arrayBuffer();
        const needDispatch = this.needDispatch(key);
        const oldValue = needDispatch ? await this.getItem(key) : undefined;

        await db.put(STORE_NAME, buffer, key);
        if (needDispatch) {
            this.dispatchChangeEvent(key, ActionType.UPDATE, value, oldValue);
        }
    }
    /**
     * Clears all items from the IndexedDB object store.
     *
     * @returns A promise that resolves when all items are cleared
     */
    async clear(): Promise<void> {
        const db = await this.idbPromise;
        await db.clear(STORE_NAME);
    }
    /**
     * Observes changes to a specific storage key.
     * Note: IndexedDB doesn't support cross-tab observation natively.
     *
     * @param key - The key to observe
     * @param onChange - Callback function invoked when the key changes
     * @returns A function that can be called to stop observing
     */
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
