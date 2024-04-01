import { StorageProvider } from '../../types/StorageProvider';
export declare class MemoryStorageProvider implements StorageProvider {
    private _cache;
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<string | undefined>;
    remove(key: string): Promise<void>;
}
