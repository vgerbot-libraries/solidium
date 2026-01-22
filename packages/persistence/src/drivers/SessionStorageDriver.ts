import { StorageDriver } from '../core/driver/StorageDriver';
import { StorageDriverOptions } from '../core/driver/StorageDriverOptions';
import { BrowserStorageDriver } from './BrowserStorageDriver';

/**
 * Storage driver implementation that uses the browser's sessionStorage API.
 * Data persists only for the duration of the browser session and is not shared across tabs.
 *
 * @public
 */
export class SessionStorageDriver
    extends BrowserStorageDriver
    implements StorageDriver
{
    /**
     * The name identifier for this driver.
     */
    readonly name = 'SessionStorageDriver';
    /**
     * Creates a new SessionStorageDriver instance with the specified bucket name.
     *
     * @param bucketName - The name of the storage bucket
     * @returns A new SessionStorageDriver instance
     */
    static createInstance(bucketName: string) {
        return new SessionStorageDriver({ bucketName });
    }
    /**
     * Creates a new SessionStorageDriver instance.
     *
     * @param options - Configuration options for the driver
     */
    constructor(options: StorageDriverOptions) {
        super(options, window.sessionStorage);
    }
}
