import { StorageOptions } from '../../types/StorageOptions';
import { StorageDriver } from '../StorageDriver';

export class LocalStorageDriver implements StorageDriver {
    static readonly driver: string = '';

    constructor(private readonly options: StorageOptions) {}
    private getKeyPrefix() {
        return [
            'solidium-storage',
            this.options.name,
            this.options.storeName
        ].join('.');
    }
    prepare(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    supports(): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    iterate(): AsyncGenerator<{ key: string; value: string | Blob }> {
        throw new Error('Method not implemented.');
    }
    getItem(key: string): Promise<string | Blob> {
        throw new Error('Method not implemented.');
    }
    removeItem(key: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
    setItem(key: string, value: string | Blob): Promise<void> {
        throw new Error('Method not implemented.');
    }
    length(): Promise<number> {
        throw new Error('Method not implemented.');
    }
    keyAt(index: number): Promise<string> {
        throw new Error('Method not implemented.');
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
    observe(key: string, onChange: () => void): () => void {
        throw new Error('Method not implemented.');
    }
}
