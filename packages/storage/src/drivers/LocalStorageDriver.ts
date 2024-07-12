import { createBlob, createPlainTextBlob } from '../common/createBlob';
import { ChangeBy } from '../types/ChangeBy';
import {
    StorageDriver,
    StorageDriverChangeEventListener
} from '../core/driver/StorageDriver';
import { StorageDriverOptions } from '../core/driver/StorageDriverOptions';
import { DriverChangeEvent } from '../core/driver/ChangeEvent';
import { ActionType } from '../types/ActionType';

export class LocalStorageDriver implements StorageDriver {
    readonly name = 'LocalStorageDriver';
    static createInstance(bucketName: string) {
        return new LocalStorageDriver({ bucketName });
    }
    private readonly changeListeners = new Map<
        string,
        StorageDriverChangeEventListener[]
    >();
    constructor(private readonly options: StorageDriverOptions) {}
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
        return Promise.resolve(typeof localStorage !== 'undefined');
    }
    async *iterate(): AsyncGenerator<{ key: string; value: Blob }> {
        const len = localStorage.length;
        const prefix = this.getKeyPrefix();
        const regex = new RegExp('^' + prefix + '.');
        for (let i = 0; i < len; i++) {
            const key = localStorage.key(i);
            if (!key?.match(regex)) {
                continue;
            }
            const value = localStorage.getItem(key);
            if (!value) {
                continue;
            }
            yield {
                key,
                value: createBlob([value], {})
            };
        }
    }
    getItem(key: string): Promise<Blob> {
        const normalizedKey = this.normalizeKey(key);
        return Promise.resolve(this.getItemByNormalizedKey(normalizedKey));
    }
    private getItemByNormalizedKey(key: string) {
        const value = localStorage.getItem(key);
        if (!value) {
            return new Blob();
        }
        return this.deserialize(value);
    }
    removeItem(key: string): Promise<void> {
        const normalizedKey = this.normalizeKey(key);
        let oldValue: Blob | undefined;
        const needDispatch = this.needDispatch(normalizedKey);
        if (needDispatch) {
            oldValue = this.getItemByNormalizedKey(normalizedKey);
        }
        localStorage.removeItem(normalizedKey);
        if (needDispatch) {
            this.dispatchChangeEvent(
                ChangeBy.SELF,
                ActionType.REMOVE,
                normalizedKey,
                undefined,
                oldValue
            );
        }
        return Promise.resolve();
    }
    async setItem(key: string, value: Blob): Promise<void> {
        const normalizeKey = this.normalizeKey(key);
        const needDispatch = this.needDispatch(normalizeKey);
        let oldValue: Blob | undefined;
        if (needDispatch) {
            oldValue = this.getItemByNormalizedKey(normalizeKey);
        }
        const serialized = await this.serialize(value);
        localStorage.setItem(normalizeKey, serialized);
        if (needDispatch) {
            this.dispatchChangeEvent(
                ChangeBy.SELF,
                ActionType.UPDATE,
                normalizeKey,
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
        const length = this.changeListeners.get(key)?.length;
        return length === undefined ? false : length > 0;
    }
    private dispatchChangeEvent(
        changeBy: ChangeBy,
        actionType: ActionType,
        key: string,
        newValue?: Blob,
        oldValue?: Blob
    ) {
        const listeners = this.changeListeners.get(key);
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
        const len = localStorage.length;
        const prefix = this.getKeyPrefix();
        for (let i = 0; i < len; i++) {
            const key = localStorage.key(i);
            if (key?.indexOf(prefix) === 0) {
                yield key;
            }
        }
    }
    async clear(): Promise<void> {
        for await (const key of this.keys()) {
            localStorage.removeItem(key);
        }
    }
    observe(
        key: string,
        onChange: (event: DriverChangeEvent) => void
    ): () => void {
        const fullKey = this.normalizeKey(key);
        const changeListener = onChange.bind(this);
        const listeners = this.changeListeners.get(fullKey) || [];
        listeners.push(changeListener);
        this.changeListeners.set(fullKey, listeners);

        return () => {
            const index = listeners.indexOf(changeListener);
            if (index === -1) {
                return;
            }
            listeners.splice(index, 1);
        };
    }
}
