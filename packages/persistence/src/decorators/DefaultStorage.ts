import { defineClassDecoratorProcessor } from '@vgerbot/solidium';
import { ClassMetadata, ClassMetadataReader, Newable } from '@vgerbot/ioc';
import { StorageOptions } from './Storage';

/**
 * Symbol to mark class with default storage options
 * This is used internally to store and retrieve default storage options for a class
 */
export const DEFAULT_STORAGE_OPTIONS = Symbol(
    'solidium-default-storage-options'
);

/**
 * Class decorator to configure default storage options for all @Storage decorated properties
 * in a class that don't specify their own options.
 *
 * @example
 * ```typescript
 * @DefaultStorage({
 *   bucket: 'default-bucket-name'
 * })
 * class MyService {
 *   @Signal()
 *   @Storage() // Will use the default bucket from class decorator
 *   myProperty: string = 'default value';
 *
 *   @Signal()
 *   @Storage({ bucket: 'another-bucket' }) // Will override the default
 *   anotherProperty: number = 42;
 * }
 * ```
 */
export const DefaultStorage = (options: Omit<StorageOptions, 'key'> = {}) => {
    return defineClassDecoratorProcessor(DEFAULT_STORAGE_OPTIONS, {
        beforeInstantiation<T>(
            constructor: Newable<T>,
            metadata: ClassMetadata<T>
        ) {
            // Store the default options in class metadata using Mark
            metadata.marker().ctor(DEFAULT_STORAGE_OPTIONS, options);
        }
    }) as ClassDecorator;
};

/**
 * Gets the default storage options for a class if they exist
 * This is used internally by the Storage decorator
 */
export function getDefaultStorageOptions<T>(
    metadata: ClassMetadataReader<T>
): StorageOptions | undefined {
    const ctorMarkInfo = metadata.getCtorMarkInfo();
    return ctorMarkInfo?.[DEFAULT_STORAGE_OPTIONS] as
        | StorageOptions
        | undefined;
}
