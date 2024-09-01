import { StorageDriver } from '../core/driver/StorageDriver';
import { StorageDriverOptions } from '../core/driver/StorageDriverOptions';
import { BrowserStorageDriver } from './BrowserStorageDriver';
export declare class LocalStorageDriver extends BrowserStorageDriver implements StorageDriver {
    readonly name = "LocalStorageDriver";
    static createInstance(bucketName: string): LocalStorageDriver;
    constructor(options: StorageDriverOptions);
}
