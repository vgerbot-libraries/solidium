import { StorageProvider } from '../../types/StorageProvider';

export class MemoryStorageProvider implements StorageProvider {
    private _cache = new Map<string, string>();
    set(key: string, value: string): Promise<void> {
        this._cache.set(key, value);
        return Promise.resolve();
    }
    get(key: string): Promise<string | undefined> {
        return Promise.resolve(this._cache.get(key));
    }
    remove(key: string): Promise<void> {
        this._cache.delete(key);
        return Promise.resolve();
    }
}
