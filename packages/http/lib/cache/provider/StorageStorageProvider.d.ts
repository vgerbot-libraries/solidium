import { StorageProvider } from '../../types/StorageProvider';
declare class BrowserStorageProvider implements StorageProvider {
    protected storage: Storage;
    constructor(storage: Storage);
    private readonly PREFIX;
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<string | undefined>;
    remove(key: string): Promise<void>;
}
export declare class LocalStorageProvider extends BrowserStorageProvider {
    constructor();
}
export declare class SessionStorageProvider extends BrowserStorageProvider {
    constructor();
}
export {};
