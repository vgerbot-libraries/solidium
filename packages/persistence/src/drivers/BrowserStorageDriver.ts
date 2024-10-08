import { createBlob, createPlainTextBlob } from '../common/createBlob';
import { ChangeBy } from '../types/ChangeBy';
import {
    StorageDriver,
    StorageDriverChangeEventListener
} from '../core/driver/StorageDriver';
import { StorageDriverOptions } from '../core/driver/StorageDriverOptions';
import { DriverChangeEvent } from '../core/driver/ChangeEvent';
import { ActionType } from '../types/ActionType';

export abstract class BrowserStorageDriver implements StorageDriver {
    abstract readonly name: string;
    private readonly observers = new Map<
        string,
        StorageDriverChangeEventListener[]
    >();
    protected constructor(
        private readonly options: StorageDriverOptions,
        protected readonly storage: Storage
    ) {}
    private getKeyPrefix() {
        return this.options.bucketName;
    }
    private normalizeKey(key: string) {
        return `${this.getKeyPrefix()}.${key.replace(/\./g, '_')}`;
    }
    prepare(): Promise<void> {
        const storageEventListener = (event: StorageEvent) => {
            const { key, newValue, oldValue } = event;
            if (key === null) {
                return;
            }
            const newValueBlob = newValue
                ? createPlainTextBlob(newValue)
                : undefined;
            const oldValueBlob = oldValue
                ? createPlainTextBlob(oldValue)
                : undefined;
            this.dispatchChangeEvent(
                ChangeBy.OTHER,
                ActionType.UPDATE,
                key,
                newValueBlob,
                oldValueBlob
            );
        };
        window.addEventListener('storage', storageEventListener);
        return Promise.resolve();
    }
    supports(): Promise<boolean> {
        return Promise.resolve(typeof this.storage !== 'undefined');
    }
    async *iterate(): AsyncGenerator<{ key: string; value: Blob }> {
        const len = this.storage.length;
        const prefix = this.getKeyPrefix();
        const regex = new RegExp('^' + prefix + '.');
        for (let i = 0; i < len; i++) {
            const key = this.storage.key(i);
            if (!key?.match(regex)) {
                continue;
            }
            const value = this.storage.getItem(key);
            if (!value) {
                continue;
            }
            yield {
                key,
                value: createBlob([value], {})
            };
        }
    }
    getItem(key: string): Promise<Blob | undefined> {
        const normalizedKey = this.normalizeKey(key);
        return Promise.resolve(this.getItemByNormalizedKey(normalizedKey));
    }
    private getItemByNormalizedKey(key: string) {
        const value = this.storage.getItem(key);
        if (!value) {
            return;
        }
        return this.deserialize(value);
    }
    removeItem(key: string): Promise<void> {
        const normalizedKey = this.normalizeKey(key);
        let oldValue: Blob | undefined;
        const needDispatch = this.needDispatch(key);
        if (needDispatch) {
            oldValue = this.getItemByNormalizedKey(normalizedKey);
        }
        this.storage.removeItem(normalizedKey);
        if (needDispatch) {
            this.dispatchChangeEvent(
                ChangeBy.SELF,
                ActionType.REMOVE,
                key,
                undefined,
                oldValue
            );
        }
        return Promise.resolve();
    }
    async setItem(key: string, value: Blob): Promise<void> {
        const normalizeKey = this.normalizeKey(key);
        const needDispatch = this.needDispatch(key);
        let oldValue: Blob | undefined;
        if (needDispatch) {
            oldValue = this.getItemByNormalizedKey(normalizeKey);
        }
        const serialized = await this.serialize(value);
        this.storage.setItem(normalizeKey, serialized);
        if (needDispatch) {
            this.dispatchChangeEvent(
                ChangeBy.SELF,
                ActionType.UPDATE,
                key,
                value,
                oldValue
            );
        }
    }
    async length(): Promise<number> {
        let len = 0;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const _ of this.keys()) {
            len++;
        }
        return len;
    }
    async keyAt(index: number): Promise<string | undefined> {
        let i = 0;
        for await (const key of this.keys()) {
            if (i === index) {
                return key;
            }
            i++;
        }
        return;
    }
    private deserialize(str: string): Blob {
        const { type, text, hex: hexData } = JSON.parse(str);
        if (text) {
            return createBlob([text], { type });
        }
        const len = hexData.length / 2;
        const u8a = new Uint8Array(len);
        for (let i = 0; i < len; i += 2) {
            const hex = hexData.substring(i * 2, i * 2 + 2);
            u8a[i] = parseInt(hex, 16);
        }
        return createBlob([u8a], { type });
    }
    private async serialize(blob: Blob): Promise<string> {
        if (blob.type.indexOf('text/') > -1) {
            const text = await blob.text();
            return JSON.stringify({
                type: blob.type,
                text: text
            });
        } else {
            const buffer = await blob.arrayBuffer();
            const u8a = new Uint8Array(buffer);
            let hex = '';
            u8a.forEach(v => {
                hex += v.toString(16).padStart(2, '0');
            });
            return JSON.stringify({
                type: blob.type,
                hex
            });
        }
    }
    private needDispatch(key: string) {
        return !!this.observers.get(key)?.length;
    }
    private dispatchChangeEvent(
        changeBy: ChangeBy,
        actionType: ActionType,
        key: string,
        newValue?: Blob,
        oldValue?: Blob
    ) {
        const listeners = this.observers.get(key);
        listeners?.forEach(listener => {
            listener({
                target: this,
                key,
                changeBy,
                action: actionType,
                newValue,
                originValue: oldValue
            });
        });
    }
    async *keys(): AsyncGenerator<string> {
        const len = this.storage.length;
        const prefix = this.getKeyPrefix();
        for (let i = 0; i < len; i++) {
            const key = this.storage.key(i);
            if (key?.indexOf(prefix) === 0) {
                yield key;
            }
        }
    }
    async clear(): Promise<void> {
        for await (const key of this.keys()) {
            this.storage.removeItem(key);
        }
    }
    observe(
        key: string,
        onChange: (event: DriverChangeEvent) => void
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
}
