import { StorageDriver } from '../driver/StorageDriver';
import { DataSerializer } from '../serializer/DataSerializer';
import { DefaultDrivers } from '../../drivers/DefaultDrivers';

/**
 * Configuration options for creating a storage bucket.
 * 
 * @public
 */
export interface BucketConfiguration {
    /**
     * The name of the bucket. Used as a namespace for storing data.
     */
    name: string;
    /**
     * Enable debug mode to log storage operations to the console.
     * @defaultValue false
     */
    debug?: boolean;
    /**
     * Version number for the bucket, primarily used with IndexedDB for schema migrations.
     * @defaultValue 1.0
     */
    version?: number;
    /**
     * The storage driver to use. Can be one of the default drivers or a custom implementation.
     * @defaultValue DefaultDrivers.LOCAL_STORAGE
     */
    driver?: DefaultDrivers | StorageDriver;
    /**
     * Custom serializer for encoding/decoding data. If not provided, uses DefaultSerializer.
     * @defaultValue DefaultSerializer
     */
    serializer?: DataSerializer;
    /**
     * Optional description of the bucket's purpose.
     */
    description?: string;
}
