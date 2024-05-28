import { StorageOptions } from '../types/StorageOptions';

export interface StorageDriverConstructor {
    driver: string;
    new (options: StorageOptions): StorageDriver;
}

export interface StorageDriver {
    prepare(): Promise<void>;
    supports(): Promise<boolean>;
    iterate(): AsyncGenerator<{
        key: string;
        value: string | Blob;
    }>;
    getItem(key: string): Promise<undefined | string | Blob>;
    removeItem(key: string): Promise<void>;
    setItem(key: string, value: string | Blob): Promise<void>;
    length(): Promise<number>;
    keyAt(index: number): Promise<string>;
    keys(): AsyncGenerator<string>;
    clear(): Promise<void>;
    drop(): Promise<void>;
    observe(key: string, onChange: () => void): () => void;
}
