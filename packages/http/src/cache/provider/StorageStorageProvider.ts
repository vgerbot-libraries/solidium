import { StorageProvider } from '../../types/StorageProvider';

class BrowserStorageProvider implements StorageProvider {
    constructor(protected storage: Storage) {}
    private readonly PREFIX = 'solidium-http-cache-';
    set(key: string, value: string): Promise<void> {
        this.storage.setItem(this.PREFIX + key, value);
        return Promise.resolve();
    }
    get(key: string): Promise<string | undefined> {
        return Promise.resolve(
            this.storage.getItem(this.PREFIX + key) || undefined
        );
    }
    remove(key: string): Promise<void> {
        this.storage.removeItem(this.PREFIX + key);
        return Promise.resolve();
    }
}
export class LocalStorageProvider extends BrowserStorageProvider {
    constructor() {
        super(localStorage);
    }
}
export class SessionStorageProvider extends BrowserStorageProvider {
    constructor() {
        super(sessionStorage);
    }
}
