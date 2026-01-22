import type { DriverChangeEvent } from "./ChangeEvent";
import type { StorageDriverOptions } from "./StorageDriverOptions";

/**
 * Constructor interface for storage driver implementations.
 *
 * @public
 */
export interface StorageDriverConstructor {
	/**
	 * The name identifier of the driver.
	 */
	driver: string;
	/**
	 * Constructs a new storage driver instance.
	 * @param options - Configuration options for the driver
	 */
	new (options: StorageDriverOptions): StorageDriver;
}

/**
 * Type definition for storage driver change event listeners.
 *
 * @public
 * @param event - The change event object
 */
export type StorageDriverChangeEventListener = (
	event: DriverChangeEvent,
) => void;

/**
 * Interface that all storage drivers must implement.
 * Provides a unified API for different storage backends (localStorage, IndexedDB, etc.).
 *
 * @public
 */
export interface StorageDriver {
	/**
	 * The name of this storage driver.
	 */
	readonly name: string;
	/**
	 * Prepares the storage driver for use. Called once during initialization.
	 * @returns A promise that resolves when the driver is ready
	 */
	prepare(): Promise<void>;
	/**
	 * Checks if the storage driver is supported in the current environment.
	 * @returns A promise that resolves to true if supported, false otherwise
	 */
	supports(): Promise<boolean>;
	/**
	 * Retrieves an item from storage.
	 * @param key - The key of the item to retrieve
	 * @returns A promise that resolves to the stored Blob, or undefined if not found
	 */
	getItem(key: string): Promise<undefined | Blob>;
	/**
	 * Removes an item from storage.
	 * @param key - The key of the item to remove
	 * @returns A promise that resolves when the item is removed
	 */
	removeItem(key: string): Promise<void>;
	/**
	 * Stores an item in storage.
	 * @param key - The key to store the item under
	 * @param value - The Blob value to store
	 * @returns A promise that resolves when the item is stored
	 */
	setItem(key: string, value: Blob): Promise<void>;
	/**
	 * Clears all items from storage managed by this driver.
	 * @returns A promise that resolves when storage is cleared
	 */
	clear(): Promise<void>;
	/**
	 * Observes changes to a specific storage key.
	 * @param key - The key to observe
	 * @param onChange - Callback function invoked when the key changes
	 * @returns A function that can be called to stop observing
	 */
	observe(key: string, onChange: StorageDriverChangeEventListener): () => void;
}
