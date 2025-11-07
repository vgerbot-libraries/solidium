import { MemberKey, ClassMetadataReader } from '@vgerbot/ioc';

/**
 * Defines the type of action performed on storage.
 *
 * @public
 */
declare enum ActionType {
    /**
     * Represents an update or insert operation on a storage item.
     */
    UPDATE = 0,
    /**
     * Represents a removal operation on a storage item.
     */
    REMOVE = 1
}

/**
 * Indicates the source of a storage change event.
 *
 * @public
 */
declare enum ChangeBy {
    /**
     * The change was triggered by the current application instance.
     */
    SELF = 0,
    /**
     * The change was triggered by another application instance or external source.
     * For example, changes from other browser tabs/windows.
     */
    OTHER = 1
}

/**
 * Represents the supported data types that can be stored in persistence storage.
 *
 * @public
 */
type Data = string | number | boolean | Blob;

/**
 * Event object emitted by a storage driver when a storage item changes.
 *
 * @public
 */
interface DriverChangeEvent {
    /**
     * The storage driver instance where the change occurred.
     */
    target: StorageDriver;
    /**
     * The key of the storage item that changed.
     */
    key: string;
    /**
     * Indicates whether the change was made by the current instance or another source.
     */
    changeBy: ChangeBy;
    /**
     * The type of action performed (update or remove).
     */
    action: ActionType;
    /**
     * The value before the change (undefined if the item was newly created).
     */
    originValue?: Data;
    /**
     * The new value after the change (undefined if the item was removed).
     */
    newValue?: Data;
}

/**
 * Options for initializing a storage driver.
 *
 * @public
 */
interface StorageDriverOptions {
    /**
     * The name of the bucket this driver will manage.
     */
    bucketName: string;
    /**
     * Version number for drivers that support versioning (e.g., IndexedDB).
     */
    version?: number;
}

/**
 * Constructor interface for storage driver implementations.
 *
 * @public
 */
interface StorageDriverConstructor {
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
type StorageDriverChangeEventListener = (event: DriverChangeEvent) => void;
/**
 * Interface that all storage drivers must implement.
 * Provides a unified API for different storage backends (localStorage, IndexedDB, etc.).
 *
 * @public
 */
interface StorageDriver {
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

/**
 * Interface for serializing and deserializing data for storage.
 * Custom implementations can be provided to support different serialization formats.
 *
 * @public
 */
interface DataSerializer {
    /**
     * Serializes a value into a Blob for storage.
     * @param value - The value to serialize
     * @returns A promise that resolves to a Blob containing the serialized data
     */
    serialize(value: unknown): Promise<Blob>;
    /**
     * Deserializes a Blob back into its original value.
     * @param data - The Blob containing serialized data
     * @returns A promise that resolves to the deserialized value
     * @typeParam T - The expected type of the deserialized value
     */
    deserialize<T>(data: Blob): Promise<T>;
}

/**
 * Enumeration of built-in storage drivers available in the persistence library.
 *
 * @public
 */
declare enum DefaultDrivers {
    /**
     * Uses browser's localStorage API for persistent storage across sessions.
     */
    LOCAL_STORAGE = "localStorage",
    /**
     * Uses browser's sessionStorage API for storage that persists only for the session.
     */
    SESSION_STORAGE = "sessionStorage",
    /**
     * Uses browser's IndexedDB API for more advanced persistent storage with larger capacity.
     */
    INDEXED_DB = "indexedDB"
}

/**
 * Configuration options for creating a storage bucket.
 *
 * @public
 */
interface BucketConfiguration {
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

/**
 * Event object emitted when a storage item changes in a bucket.
 *
 * @public
 */
interface ChangeEvent {
    /**
     * The bucket instance where the change occurred.
     */
    target: Bucket;
    /**
     * The key of the storage item that changed.
     */
    key: string;
    /**
     * Indicates whether the change was made by the current instance or another source.
     */
    changeBy: ChangeBy;
    /**
     * The type of action performed (update or remove).
     */
    action: ActionType;
    /**
     * The value before the change (undefined if the item was newly created).
     */
    originValue?: Data;
    /**
     * The new value after the change (undefined if the item was removed).
     */
    newValue?: Data;
}

declare const PREPARE: unique symbol;
/**
 * Represents a storage bucket that provides a high-level API for persistent data storage.
 * A bucket uses a storage driver for the underlying storage mechanism and a serializer
 * for encoding/decoding data.
 *
 * @public
 */
declare class Bucket {
    /**
     * The name of this bucket.
     */
    readonly name: string;
    private readonly driver;
    private readonly serializer;
    /**
     * Whether debug mode is enabled for logging storage operations.
     */
    readonly debug: boolean;
    /**
     * Creates a new Bucket instance.
     * @param config - Configuration options for the bucket
     */
    constructor(config: BucketConfiguration);
    [PREPARE](): Promise<void>;
    private prepared;
    /**
     * Observes changes to a specific storage key within this bucket.
     * The observer will be notified when the key is updated or removed.
     *
     * @param key - The key to observe
     * @param onChange - Callback function invoked when the key changes
     * @returns A function that can be called to stop observing
     *
     * @example
     * ```typescript
     * const unobserve = bucket.observe('myKey', (event) => {
     *   console.log('Value changed:', event.newValue);
     * });
     *
     * // Later, to stop observing:
     * unobserve();
     * ```
     */
    observe(key: string, onChange: (event: ChangeEvent) => void): () => void;
    /**
     * Stores a value in the bucket under the specified key.
     * The value will be serialized before storage.
     *
     * @param key - The key to store the value under
     * @param value - The value to store
     * @returns A promise that resolves when the value is stored
     *
     * @example
     * ```typescript
     * await bucket.setItem('user', { name: 'John', age: 30 });
     * ```
     */
    setItem(key: string, value: unknown): Promise<void>;
    /**
     * Retrieves a value from the bucket by key.
     * The value will be deserialized before being returned.
     *
     * @param key - The key of the value to retrieve
     * @returns A promise that resolves to the stored value, or undefined if not found
     * @typeParam T - The expected type of the stored value
     *
     * @example
     * ```typescript
     * const user = await bucket.getItem<User>('user');
     * if (user) {
     *   console.log(user.name);
     * }
     * ```
     */
    getItem<T>(key: string): Promise<T | undefined>;
    /**
     * Clears all items from the bucket.
     *
     * @returns A promise that resolves when the bucket is cleared
     */
    clear(): Promise<void>;
    /**
     * Removes an item from the bucket by key.
     *
     * @param key - The key of the item to remove
     * @returns A promise that resolves when the item is removed
     */
    removeItem(key: string): Promise<void>;
    /**
     * Creates a property decorator that binds a signal property to this bucket.
     * This is equivalent to using `@Storage({ bucket: this, key })`.
     *
     * @param key - The storage key to use for this property
     * @returns A property decorator
     *
     * @example
     * ```typescript
     * class MyService {
     *   @Signal()
     *   @myBucket.value('username')
     *   username: string;
     * }
     * ```
     */
    value(key: string): PropertyDecorator;
}

/**
 * Main entry point for the persistence system.
 * Provides factory methods for configuring storage buckets.
 *
 * @example
 * Configure default and custom buckets in your Solidium application:
 * ```tsx
 * <Solidium autoRegisterClasses={[
 *   Persistence.default({
 *     driver: DefaultDrivers.LOCAL_STORAGE,
 *     debug: true
 *   }),
 *   Persistence.bucket('custom-bucket-name', {
 *     name: 'custom-bucket-name',
 *     driver: DefaultDrivers.INDEXED_DB,
 *     version: 1.0
 *   })
 * ]}></Solidium>
 * ```
 *
 * @example
 * Use storage decorators in your services:
 * ```typescript
 * class BizService {
 *   @Signal()
 *   @Storage() // uses default bucket
 *   autoSaveToDefaultStorage: boolean;
 *
 *   @Signal()
 *   @Storage({
 *     bucket: 'custom-bucket-name'
 *   })
 *   autoSaveToCustomStorage: boolean;
 * }
 * ```
 *
 * @public
 */
declare class Persistence {
    /**
     * Creates a factory wrapper for the default storage bucket configuration.
     * The default bucket is used when no bucket is specified in `@Storage()` decorators.
     *
     * @param configuration - Configuration options for the default bucket (name is automatically set)
     * @returns A factory wrapper that can be registered with Solidium
     *
     * @example
     * ```typescript
     * Persistence.default({
     *   driver: DefaultDrivers.LOCAL_STORAGE,
     *   debug: true
     * })
     * ```
     */
    static default(configuration?: Omit<BucketConfiguration, 'name'>): typeof Persistence;
    /**
     * Creates a factory wrapper for a custom named storage bucket.
     * Named buckets can be referenced in `@Storage()` decorators by their name.
     *
     * @param name - The name identifier for this bucket
     * @param configuration - Configuration options for the bucket
     * @returns A factory wrapper that can be registered with Solidium
     *
     * @example
     * ```typescript
     * Persistence.bucket('user-preferences', {
     *   name: 'user-preferences',
     *   driver: DefaultDrivers.INDEXED_DB,
     *   version: 1.0
     * })
     * ```
     */
    static bucket(name: string, configuration: BucketConfiguration): typeof Persistence;
    private configuration;
    /**
     * Factory method that creates and returns the default bucket instance.
     * @internal
     */
    getDefaultBucket(): Bucket;
    /**
     * Initialization hook called after dependency injection.
     * @internal
     */
    init(): void;
}

/**
 * Default serializer implementation using MessagePack format.
 * Provides efficient binary serialization for JavaScript values.
 *
 * @public
 */
declare class DefaultSerializer implements DataSerializer {
    /**
     * Serializes a value into a Blob using MessagePack encoding.
     * @param value - The value to serialize
     * @returns A promise that resolves to a Blob containing the MessagePack encoded data
     */
    serialize(value: unknown): Promise<Blob>;
    /**
     * Deserializes a Blob back into its original value using MessagePack decoding.
     * @param data - The Blob containing MessagePack encoded data
     * @returns A promise that resolves to the deserialized value
     * @typeParam T - The expected type of the deserialized value
     */
    deserialize<T>(data: Blob): Promise<T>;
}

/**
 * Configuration options for the Storage decorator.
 *
 * @public
 */
interface StorageOptions {
    /**
     * The bucket to use for storage. Can be:
     * - A string name referencing a registered bucket
     * - A symbol identifier for a bucket
     * - A Bucket instance directly
     *
     * @defaultValue DEFAULT_BUCKET (the default bucket)
     */
    bucket?: string | symbol | Bucket;
    /**
     * The storage key to use. If not specified, the property name will be used.
     */
    key?: string;
    /**
     * Data version identifier for migration control.
     *
     * When the stored data version differs from this version, the library will trigger
     * a migration process using the specified `migrationStrategy`. This enables safe
     * data schema evolution and backward compatibility during application updates.
     *
     * **Behavior:**
     * - If versions match: Load stored data directly
     * - If versions differ: Apply migration strategy to determine final value
     * - If no version specified: Always load stored data (no migration)
     *
     * **Use cases:**
     * - Schema changes requiring data transformation
     * - Breaking changes in data structure
     * - Feature flags or configuration updates
     *
     * @example
     * ```typescript
     * @Storage({ version: '2.0' })
     * userPreferences: UserPreferences = defaultPreferences;
     * ```
     */
    version?: string;
    /**
     * Migration strategy when data version changes.
     *
     * Defines how to handle data when the stored version differs from the current
     * `version`. This allows for flexible data migration strategies during application
     * updates while maintaining data integrity.
     *
     * **Built-in strategies:**
     * - `'overwrite'`: Replace stored data with the property's initial value (default)
     * - `'keep'`: Preserve the existing stored data, ignoring initial value
     *
     * **Custom strategy function:**
     * Receives `(newValue, cachedValue)` and returns the final value to use.
     * - `newValue`: The property's current initial value
     * - `cachedValue`: The value stored in persistence
     *
     * **Use cases:**
     * - `'overwrite'`: When breaking changes require fresh data
     * - `'keep'`: When preserving user data is important
     * - Custom function: For complex data transformations or merging logic
     *
     * @defaultValue 'overwrite'
     *
     * @example
     * ```typescript
     * // Keep existing data during migration
     * @Storage({
     *   version: '2.0',
     *   migrationStrategy: 'keep'
     * })
     * userSettings: UserSettings = defaultSettings;
     *
     * // Custom migration logic
     * @Storage({
     *   version: '2.0',
     *   migrationStrategy: (newValue, cachedValue) => {
     *     // Merge old and new data
     *     return { ...newValue, ...cachedValue };
     *   }
     * })
     * userPreferences: UserPreferences = defaultPreferences;
     * ```
     */
    migrationStrategy?: 'overwrite' | 'keep' | (<T>(newValue?: T, cachedValue?: T) => T | undefined);
    /**
     * Debounce delay in milliseconds for save operations.
     * When the property changes frequently, this delay prevents
     * excessive storage writes by waiting for the specified time
     * before actually saving.
     *
     * @defaultValue 300 (300ms)
     */
    debounceMs?: number;
}
/**
 * Property decorator that automatically persists a signal property to storage.
 * The decorated property must be a signal created with `@Signal()`.
 *
 * When the property changes, the new value is automatically saved to storage.
 * When the component initializes, the last saved value is automatically loaded.
 *
 * @param options - Configuration options for storage behavior
 * @returns A property decorator
 *
 * @example
 * Basic usage with default bucket:
 * ```typescript
 * class UserPreferences {
 *   @Signal()
 *   @Storage()
 *   theme: 'light' | 'dark' = 'light';
 * }
 * ```
 *
 * @example
 * Using a custom bucket and key:
 * ```typescript
 * class UserPreferences {
 *   @Signal()
 *   @Storage({
 *     bucket: 'user-preferences',
 *     key: 'app-theme'
 *   })
 *   theme: 'light' | 'dark' = 'light';
 * }
 * ```
 *
 * @public
 */
declare const Storage: (options?: string | StorageOptions) => <T extends Record<MemberKey, unknown>>(target: Object, propertyKey: string | symbol) => void;

/**
 * Symbol to mark class with default storage options
 * This is used internally to store and retrieve default storage options for a class
 */
declare const DEFAULT_STORAGE_OPTIONS: unique symbol;
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
declare const DefaultStorage: (options?: Omit<StorageOptions, "key">) => ClassDecorator;
/**
 * Gets the default storage options for a class if they exist
 * This is used internally by the Storage decorator
 */
declare function getDefaultStorageOptions<T>(metadata: ClassMetadataReader<T>): StorageOptions | undefined;

/**
 * Event object passed to `@OnStorageLoad` decorated methods.
 *
 * @typeParam T - The type of the class instance
 * @typeParam D - The type of the loaded data
 *
 * @public
 */
interface StorageLoadEvent<T, D = unknown> {
    /**
     * The class instance where the storage property was loaded.
     */
    instance: T;
    /**
     * The property key that was loaded from storage.
     */
    member: PropertyKey;
    /**
     * The value that was loaded from storage.
     */
    value: D;
    /**
     * Set of all property keys that have been loaded so far.
     * Useful for tracking when multiple properties have been loaded.
     */
    loadedMembers: Set<PropertyKey>;
    /**
     * Timestamp when the value was loaded.
     */
    timestamp: number;
}
/**
 * Internal event type used by the storage system.
 * @internal
 */
type InternalStorageLoadEvent<T> = Omit<StorageLoadEvent<T>, 'loadedMembers'>;
/**
 * Type definition for storage load event listener functions.
 *
 * @public
 */
type StorageLoadEventListener = <T>(event: StorageLoadEvent<T>) => void;
/**
 * @internal
 */
type InternalStorageLoadEventListener = <T>(event: InternalStorageLoadEvent<T>) => void;
declare function notifyStorageLoad<T>(event: InternalStorageLoadEvent<T>): void;
/**
 * Configuration options for the OnStorageLoad decorator.
 *
 * @public
 */
interface StorageLoadNotifyOptions {
    /**
     * Array of property keys to monitor. If specified, the decorated method
     * will only be called when these specific properties are loaded.
     * If not specified, the method will be called for any storage property load.
     */
    members: PropertyKey[];
}
/**
 * Method decorator that marks a method to be called when storage properties are loaded.
 * The decorated method will receive a {@link StorageLoadEvent} with information about
 * the loaded property.
 *
 * This is useful for performing actions after storage values are restored, such as
 * validation, transformation, or triggering side effects.
 *
 * @param options - Optional configuration to filter which properties trigger the callback
 * @returns A method decorator
 *
 * @example
 * Called for any storage property load:
 * ```typescript
 * class UserSettings {
 *   @Signal()
 *   @Storage()
 *   theme: string = 'light';
 *
 *   @Signal()
 *   @Storage()
 *   fontSize: number = 14;
 *
 *   @OnStorageLoad()
 *   onAnyPropertyLoaded(event: StorageLoadEvent<UserSettings>) {
 *     console.log(`Loaded ${String(event.member)}: ${event.value}`);
 *   }
 * }
 * ```
 *
 * @example
 * Called only for specific properties:
 * ```typescript
 * class UserSettings {
 *   @Signal()
 *   @Storage()
 *   theme: string = 'light';
 *
 *   @Signal()
 *   @Storage()
 *   fontSize: number = 14;
 *
 *   @OnStorageLoad({ members: ['theme', 'fontSize'] })
 *   onBothLoaded(event: StorageLoadEvent<UserSettings>) {
 *     // Called after both theme and fontSize are loaded
 *     if (event.loadedMembers.size === 2) {
 *       console.log('All settings loaded!');
 *     }
 *   }
 * }
 * ```
 *
 * @public
 */
declare function OnStorageLoad(options?: StorageLoadNotifyOptions): <T extends object>(target: T, propertyKey: PropertyKey) => void;

/**
 * Event object passed to `@OnStorageChange` decorated methods.
 * Extends {@link ChangeEvent} with additional context about the instance and property.
 *
 * @typeParam T - The type of the class instance
 *
 * @public
 */
interface StorageChangeEvent<T> extends ChangeEvent {
    /**
     * The class instance where the storage property changed.
     */
    instance: T;
    /**
     * The property key that changed in storage.
     */
    member: PropertyKey;
}
/**
 * Type definition for storage change event listener functions.
 *
 * @public
 */
type StorageChangeEventListener<T> = (event: StorageChangeEvent<T>) => void;
/**
 * Internal function to notify all registered storage change listeners.
 * @internal
 */
declare function notifyStorageChange<T>(event: StorageChangeEvent<T>): void;
/**
 * Configuration options for the OnStorageChange decorator.
 * Allows filtering which storage changes trigger the decorated method.
 *
 * @public
 */
interface StorageChangeNotifyOptions {
    /**
     * Filter by change source. If specified, only changes from this source will trigger the callback.
     * - `ChangeBy.SELF`: Only changes made by the current instance
     * - `ChangeBy.OTHER`: Only changes made by other instances (e.g., other tabs)
     */
    changeBy?: ChangeBy;
    /**
     * Filter by action type. If specified, only this type of action will trigger the callback.
     * - `ActionType.UPDATE`: Only update/insert operations
     * - `ActionType.REMOVE`: Only remove operations
     */
    action?: ActionType;
    /**
     * Filter by property keys. If specified, only changes to these properties will trigger the callback.
     * If not specified, changes to any storage property will trigger the callback.
     */
    members?: PropertyKey[];
}
/**
 * Method decorator that marks a method to be called when storage properties change.
 * Unlike {@link OnStorageLoad}, which is called only once when data is initially loaded,
 * this decorator is called whenever the storage value changes (including updates and removals).
 *
 * The decorated method receives a {@link StorageChangeEvent} with information about the change,
 * including what changed, who made the change, and the old/new values.
 *
 * @param options - Optional configuration to filter which changes trigger the callback
 * @returns A method decorator
 *
 * @example
 * Called for any storage property change:
 * ```typescript
 * class UserSettings {
 *   @Signal()
 *   @Storage()
 *   theme: string = 'light';
 *
 *   @Signal()
 *   @Storage()
 *   fontSize: number = 14;
 *
 *   @OnStorageChange()
 *   onAnyChange(event: StorageChangeEvent<UserSettings>) {
 *     console.log(`${String(event.member)} changed to ${event.newValue}`);
 *     console.log(`Changed by: ${event.changeBy === ChangeBy.SELF ? 'this instance' : 'another tab'}`);
 *   }
 * }
 * ```
 *
 * @example
 * Filter by specific properties:
 * ```typescript
 * class UserSettings {
 *   @Signal()
 *   @Storage()
 *   theme: string = 'light';
 *
 *   @Signal()
 *   @Storage()
 *   fontSize: number = 14;
 *
 *   @OnStorageChange({ members: ['theme'] })
 *   onThemeChange(event: StorageChangeEvent<UserSettings>) {
 *     // Only called when theme changes
 *     this.applyTheme(event.newValue as string);
 *   }
 * }
 * ```
 *
 * @example
 * Filter by change source (cross-tab synchronization):
 * ```typescript
 * class UserSettings {
 *   @Signal()
 *   @Storage()
 *   theme: string = 'light';
 *
 *   @OnStorageChange({ changeBy: ChangeBy.OTHER })
 *   onExternalChange(event: StorageChangeEvent<UserSettings>) {
 *     // Only called when changes come from other tabs/windows
 *     console.log(`Another tab changed ${String(event.member)}`);
 *     this.showNotification(`Settings synced from another tab`);
 *   }
 * }
 * ```
 *
 * @example
 * Filter by action type:
 * ```typescript
 * class UserSettings {
 *   @Signal()
 *   @Storage()
 *   theme: string = 'light';
 *
 *   @OnStorageChange({ action: ActionType.REMOVE })
 *   onSettingRemoved(event: StorageChangeEvent<UserSettings>) {
 *     // Only called when a setting is removed
 *     console.log(`Setting ${String(event.member)} was removed`);
 *     this.restoreDefault(event.member);
 *   }
 * }
 * ```
 *
 * @example
 * Combine multiple filters:
 * ```typescript
 * class UserSettings {
 *   @Signal()
 *   @Storage()
 *   theme: string = 'light';
 *
 *   @OnStorageChange({
 *     members: ['theme', 'fontSize'],
 *     changeBy: ChangeBy.OTHER,
 *     action: ActionType.UPDATE
 *   })
 *   onExternalUpdate(event: StorageChangeEvent<UserSettings>) {
 *     // Called only when theme or fontSize is updated by another tab
 *     console.log(`${String(event.member)} synced from another tab`);
 *   }
 * }
 * ```
 *
 * @public
 */
declare function OnStorageChange(options?: StorageChangeNotifyOptions): <T extends object>(target: T, propertyKey: PropertyKey) => void;

/**
 * Symbol identifier for the default bucket configuration in the IoC container.
 * Used internally to register and retrieve the default bucket configuration.
 *
 * @public
 */
declare const DEFAULT_BUCKET_CONFIGURATION: unique symbol;
/**
 * Symbol identifier for the default bucket instance in the IoC container.
 * Used internally to register and retrieve the default bucket.
 *
 * @public
 */
declare const DEFAULT_BUCKET: unique symbol;

export { Bucket, type BucketConfiguration, type ChangeEvent, DEFAULT_BUCKET, DEFAULT_BUCKET_CONFIGURATION, DEFAULT_STORAGE_OPTIONS, type DataSerializer, DefaultDrivers, DefaultSerializer, DefaultStorage, type DriverChangeEvent, type InternalStorageLoadEvent, type InternalStorageLoadEventListener, OnStorageChange, OnStorageLoad, Persistence, Storage, type StorageChangeEvent, type StorageChangeEventListener, type StorageChangeNotifyOptions, type StorageDriver, type StorageDriverChangeEventListener, type StorageDriverConstructor, type StorageDriverOptions, type StorageLoadEvent, type StorageLoadEventListener, type StorageLoadNotifyOptions, type StorageOptions, getDefaultStorageOptions, notifyStorageChange, notifyStorageLoad };
