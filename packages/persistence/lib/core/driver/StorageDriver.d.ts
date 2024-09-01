import { DriverChangeEvent } from './ChangeEvent';
import { StorageDriverOptions } from './StorageDriverOptions';
export interface StorageDriverConstructor {
    driver: string;
    new (options: StorageDriverOptions): StorageDriver;
}
export type StorageDriverChangeEventListener = (event: DriverChangeEvent) => void;
export interface StorageDriver {
    readonly name: string;
    prepare(): Promise<void>;
    supports(): Promise<boolean>;
    getItem(key: string): Promise<undefined | Blob>;
    removeItem(key: string): Promise<void>;
    setItem(key: string, value: Blob): Promise<void>;
    clear(): Promise<void>;
    observe(key: string, onChange: StorageDriverChangeEventListener): () => void;
}
