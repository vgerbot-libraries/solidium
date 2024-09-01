import { StorageDriver } from '../core/driver/StorageDriver';
import { StorageDriverOptions } from '../core/driver/StorageDriverOptions';
import { DriverChangeEvent } from '../core/driver/ChangeEvent';
export declare abstract class BrowserStorageDriver implements StorageDriver {
    private readonly options;
    protected readonly storage: Storage;
    abstract readonly name: string;
    private readonly observers;
    constructor(options: StorageDriverOptions, storage: Storage);
    private getKeyPrefix;
    private normalizeKey;
    prepare(): Promise<void>;
    supports(): Promise<boolean>;
    iterate(): AsyncGenerator<{
        key: string;
        value: Blob;
    }>;
    getItem(key: string): Promise<Blob | undefined>;
    private getItemByNormalizedKey;
    removeItem(key: string): Promise<void>;
    setItem(key: string, value: Blob): Promise<void>;
    length(): Promise<number>;
    keyAt(index: number): Promise<string | undefined>;
    private deserialize;
    private serialize;
    private needDispatch;
    private dispatchChangeEvent;
    keys(): AsyncGenerator<string>;
    clear(): Promise<void>;
    observe(key: string, onChange: (event: DriverChangeEvent) => void): () => void;
}
