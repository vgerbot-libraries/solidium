import { StorageDriver } from '../core/driver/StorageDriver';
import { StorageDriverOptions } from '../core/driver/StorageDriverOptions';
import { BrowserStorageDriver } from './BrowserStorageDriver';

export class LocalStorageDriver
    extends BrowserStorageDriver
    implements StorageDriver
{
    readonly name = 'LocalStorageDriver';
    static createInstance(bucketName: string) {
        return new LocalStorageDriver({ bucketName });
    }
    constructor(options: StorageDriverOptions) {
        super(options, window.localStorage);
    }
}
