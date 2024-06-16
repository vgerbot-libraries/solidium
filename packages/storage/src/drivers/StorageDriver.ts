import { StorageDriverOptions } from './StorageDriverOptions';

export interface StorageDriverConstructor {
    driver: string;
    new (options: StorageDriverOptions): StorageDriver;
}

export interface StorageDriver {
    prepare(): Promise<void>;
    supports(): Promise<boolean>;
    iterate(): AsyncGenerator<{
        key: string;
        value: Blob;
    }>;
    getItem(key: string): Promise<undefined | Blob>;
    removeItem(key: string): Promise<void>;
    setItem(key: string, value: Blob): Promise<void>;
    length(): Promise<number>;
    keyAt(index: number): Promise<string>;
    keys(): AsyncGenerator<string>;
    clear(): Promise<void>;
    drop(): Promise<void>;
    observe(key: string, onChange: () => void): () => void;
}
