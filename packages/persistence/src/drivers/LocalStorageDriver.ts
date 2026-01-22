import type { StorageDriver } from "../core/driver/StorageDriver";
import type { StorageDriverOptions } from "../core/driver/StorageDriverOptions";
import { BrowserStorageDriver } from "./BrowserStorageDriver";

/**
 * Storage driver implementation that uses the browser's localStorage API.
 * Data persists across browser sessions and tabs.
 *
 * @public
 */
export class LocalStorageDriver
	extends BrowserStorageDriver
	implements StorageDriver
{
	/**
	 * The name identifier for this driver.
	 */
	readonly name = "LocalStorageDriver";
	/**
	 * Creates a new LocalStorageDriver instance with the specified bucket name.
	 *
	 * @param bucketName - The name of the storage bucket
	 * @returns A new LocalStorageDriver instance
	 */
	static createInstance(bucketName: string) {
		return new LocalStorageDriver({ bucketName });
	}
	/**
	 * Creates a new LocalStorageDriver instance.
	 *
	 * @param options - Configuration options for the driver
	 */
	constructor(options: StorageDriverOptions) {
		super(options, window.localStorage);
	}
}
