import { createBlob, createPlainTextBlob } from '../../common/createBlob';
import { StorageDriver } from '../StorageDriver';
import { StorageDriverOptions } from '../StorageDriverOptions';

export class LocalStorageDriver implements StorageDriver {
    static readonly driver: string = '';

    constructor(private readonly options: StorageDriverOptions) {}
    private getKeyPrefix() {
        return [this.options.driverName, this.options.storeName].join('.');
    }
    private normalizeKey(key: string) {
        return `${this.getKeyPrefix()}.${key.replace(/\./g, '_')}`;
    }
    prepare(): Promise<void> {
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
        const k = this.normalizeKey(key);
        const value = localStorage.getItem(k);
        if (!value) {
            return Promise.resolve(new Blob());
        }
        return Promise.resolve(this.deserialize(value));
    }
    removeItem(key: string): Promise<void> {
        const nk = this.normalizeKey(key);
        localStorage.removeItem(nk);
        return Promise.resolve();
    }
    async setItem(key: string, value: Blob): Promise<void> {
        const normalizeKey = this.normalizeKey(key);
        const serialized = await this.serialize(value);
        localStorage.setItem(normalizeKey, serialized);
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
        onChange: (newValue?: Blob, oldValue?: Blob) => void
    ): () => void {
        const fullKey = this.normalizeKey(key);
        const listener = (e: StorageEvent) => {
            const { key, newValue, oldValue } = e;
            if (fullKey !== key) {
                return;
            }
            onChange(
                newValue ? createPlainTextBlob(newValue) : undefined,
                oldValue ? createPlainTextBlob(oldValue) : undefined
            );
        };
        window.addEventListener('storage', listener);
        return () => {
            window.removeEventListener('storage', listener);
        };
    }
}
