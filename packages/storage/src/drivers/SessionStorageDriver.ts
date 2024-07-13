import { StorageDriver } from '../core/driver/StorageDriver';
import { StorageDriverOptions } from '../core/driver/StorageDriverOptions';
import { BrowserStorageDriver } from './BrowserStorageDriver';

export class SessionStorageDriver
    extends BrowserStorageDriver
    implements StorageDriver
{
    readonly name = 'SessionStorageDriver';
    static createInstance(bucketName: string) {
        return new SessionStorageDriver({ bucketName });
    }
    constructor(options: StorageDriverOptions) {
        super(options, window.localStorage);
    }
}
