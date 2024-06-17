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
        return Promise.resolve(new Blob());
    }
    removeItem(key: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    setItem(key: string, value: Blob): Promise<void> {
        throw new Error('Method not implemented.');
    }
    length(): Promise<number> {
        throw new Error('Method not implemented.');
    }
    keyAt(index: number): Promise<string> {
        throw new Error('Method not implemented.');
    }
    private deserialize(str: string): Blob {
        throw new Error('Method not implemented.');
    }
    private async serialize(blob: Blob): Promise<string> {
        if (blob.type.indexOf('text/') > -1) {
            const text = await blob.text();
            return JSON.stringify({
                type: blob.type,
                data: text
            });
        }
        // TODO:
        throw new Error('not implemented');
    }
    async *keys(): AsyncGenerator<string> {
        const len = localStorage.length;
        const prefix = this.getKeyPrefix();
        const regex = new RegExp('^' + prefix + '.');
        for (let i = 0; i < len; i++) {
            const key = localStorage.key(i);
            if (key?.match(regex)) {
                yield key;
            }
        }
    }
    clear(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    drop(): Promise<void> {
        throw new Error('Method not implemented.');
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
