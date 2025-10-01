import { createBlob, createPlainTextBlob } from '../common/createBlob';
import { ChangeBy } from '../types/ChangeBy';
import {
    StorageDriver,
    StorageDriverChangeEventListener
} from '../core/driver/StorageDriver';
import { StorageDriverOptions } from '../core/driver/StorageDriverOptions';
import { DriverChangeEvent } from '../core/driver/ChangeEvent';
import { ActionType } from '../types/ActionType';

/**
 * Abstract base class for storage drivers that use browser Web Storage APIs
 * (localStorage or sessionStorage).
 * 
 * This class provides common functionality for:
 * - Key normalization and namespacing
 * - Serialization to/from Blob format
 * - Change event observation
 * - Cross-tab synchronization via storage events
 * 
 * @public
 */
export abstract class BrowserStorageDriver implements StorageDriver {
    /**
     * The name identifier for this driver implementation.
     */
    abstract readonly name: string;
    private readonly observers = new Map<
        string,
        StorageDriverChangeEventListener[]
    >();
    /**
     * Creates a new BrowserStorageDriver instance.
     * 
     * @param options - Configuration options for the driver
     * @param storage - The Web Storage API object (localStorage or sessionStorage)
     */
    protected constructor(
        private readonly options: StorageDriverOptions,
        protected readonly storage: Storage
    ) { }
    private getKeyPrefix() {
        return this.options.bucketName;
    }
    private normalizeKey(key: string) {
        return `${this.getKeyPrefix()}.${key.replace(/\./g, '_')}`;
    }
    /**
     * Prepares the driver for use by setting up storage event listeners.
     * This enables cross-tab synchronization.
     * 
     * @returns A promise that resolves when preparation is complete
     */
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
    /**
     * Checks if the storage API is supported in the current environment.
     * 
     * @returns A promise that resolves to true if supported, false otherwise
     */
    supports(): Promise<boolean> {
        return Promise.resolve(typeof this.storage !== 'undefined');
    }
    /**
     * Iterates over all key-value pairs in this bucket.
     * 
     * @yields Objects containing key and value (as Blob)
     */
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
    /**
     * Retrieves an item from storage by key.
     * 
     * @param key - The key of the item to retrieve
     * @returns A promise that resolves to the stored Blob, or undefined if not found
     */
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
    /**
     * Removes an item from storage by key.
     * 
     * @param key - The key of the item to remove
     * @returns A promise that resolves when the item is removed
     */
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
    /**
     * Stores an item in storage.
     * 
     * @param key - The key to store the item under
     * @param value - The Blob value to store
     * @returns A promise that resolves when the item is stored
     */
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
    /**
     * Returns the number of items in this bucket.
     * 
     * @returns A promise that resolves to the item count
     */
    async length(): Promise<number> {
        let len = 0;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for await (const _ of this.keys()) {
            len++;
        }
        return len;
    }
    /**
     * Returns the key at the specified index.
     * 
     * @param index - The index of the key to retrieve
     * @returns A promise that resolves to the key, or undefined if index is out of bounds
     */
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
        const u8a = new Uint8Array(hexData.length / 2);
        const view = new DataView(u8a.buffer);
        for (let i = 0; i < hexData.length; i += 2) {
            const hex = hexData.substring(i, i + 2);
            view.setUint8(i / 2, parseInt(hex, 16));
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
            const hexArray = new Array(u8a.length);
            for (let i = 0; i < u8a.length; i++) {
                hexArray[i] = u8a[i].toString(16).padStart(2, '0');
            }
            const hex = hexArray.join('');
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
    /**
     * Iterates over all keys in this bucket.
     * 
     * @yields Storage keys belonging to this bucket
     */
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
    /**
     * Clears all items from this bucket.
     * 
     * @returns A promise that resolves when all items are cleared
     */
    async clear(): Promise<void> {
        for await (const key of this.keys()) {
            this.storage.removeItem(key);
        }
    }
    /**
     * Observes changes to a specific storage key.
     * 
     * @param key - The key to observe
     * @param onChange - Callback function invoked when the key changes
     * @returns A function that can be called to stop observing
     */
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
