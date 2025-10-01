/**
 * Options for initializing a storage driver.
 * 
 * @public
 */
export interface StorageDriverOptions {
    /**
     * The name of the bucket this driver will manage.
     */
    bucketName: string;
    /**
     * Version number for drivers that support versioning (e.g., IndexedDB).
     */
    version?: number;
}
