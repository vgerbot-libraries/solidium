import { StorageProvider } from '../../types/StorageProvider';

export class NoopStorageProvider implements StorageProvider {
    private static readonly INSTANCE = new NoopStorageProvider();

    static getInstance() {
        return this.INSTANCE;
    }

    private constructor() {
        //
    }

    set(key: string, value: string): Promise<void> {
        return Promise.resolve();
    }

    get(key: string): Promise<string | undefined> {
        return Promise.resolve(undefined);
    }

    remove(key: string): Promise<void> {
        return Promise.resolve();
    }
}
