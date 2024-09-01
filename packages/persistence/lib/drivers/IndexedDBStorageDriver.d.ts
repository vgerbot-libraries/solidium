import { StorageDriver, StorageDriverChangeEventListener } from '../core/driver/StorageDriver';
import { StorageDriverOptions } from '../core/driver/StorageDriverOptions';
export declare class IndexedDBStorageDriver implements StorageDriver {
    readonly name: string;
    private readonly observers;
    private bucketName;
    private version?;
    private idbDefer;
    private get idbPromise();
    constructor(options: StorageDriverOptions);
    prepare(): Promise<void>;
    supports(): Promise<boolean>;
    getItem(key: string): Promise<undefined | Blob>;
    removeItem(key: string): Promise<void>;
    setItem(key: string, value: Blob): Promise<void>;
    clear(): Promise<void>;
    observe(key: string, onChange: StorageDriverChangeEventListener): () => void;
    private dispatchChangeEvent;
    private needDispatch;
}
