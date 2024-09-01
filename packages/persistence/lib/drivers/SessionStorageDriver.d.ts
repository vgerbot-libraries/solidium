import { StorageDriver } from '../core/driver/StorageDriver';
import { StorageDriverOptions } from '../core/driver/StorageDriverOptions';
import { BrowserStorageDriver } from './BrowserStorageDriver';
export declare class SessionStorageDriver extends BrowserStorageDriver implements StorageDriver {
    readonly name = "SessionStorageDriver";
    static createInstance(bucketName: string): SessionStorageDriver;
    constructor(options: StorageDriverOptions);
}
