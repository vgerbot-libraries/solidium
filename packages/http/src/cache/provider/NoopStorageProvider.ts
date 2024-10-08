import { StorageProvider } from '../../types/StorageProvider';

export class NoopStorageProvider implements StorageProvider {
    private static readonly INSTANCE = new NoopStorageProvider();

    static getInstance() {
        return this.INSTANCE;
    }

    private constructor() {
        //
    }

    set(): Promise<void> {
        return Promise.resolve();
    }

    get(): Promise<string | undefined> {
        return Promise.resolve(undefined);
    }

    remove(): Promise<void> {
        return Promise.resolve();
    }
}
