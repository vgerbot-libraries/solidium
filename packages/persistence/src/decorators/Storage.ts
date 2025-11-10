import {
    defineMemberDecoratorProcessor,
    getSignal,
    isSignalMember
} from '@vgerbot/solidium';
import { createEffect, getOwner, on, onCleanup, runWithOwner } from 'solid-js';
import { debounce, leadingAndTrailing } from '@solid-primitives/scheduled';
import {
    ApplicationContext,
    ClassMetadataReader,
    MemberKey
} from '@vgerbot/ioc';
import { Bucket } from '../core/bucket/Bucket';
import { DEFAULT_BUCKET } from '../core/constants';
import { notifyStorageLoad } from './OnStorageLoad';
import { ActionType } from '../types/ActionType';
import { ChangeBy } from '../types/ChangeBy';
import { getDefaultStorageOptions } from './DefaultStorage';
import { notifyStorageChange } from './OnStorageChange';

/**
 * Configuration options for the Storage decorator.
 *
 * @public
 */
export interface StorageOptions {
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
    migrationStrategy?:
        | 'overwrite'
        | 'keep'
        | (<T>(newValue?: T, cachedValue?: T) => T | undefined);
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

interface StorageValue {
    $d: unknown;
    $v: string;
}

const BUILT_IN_MIGRATION_STRATEGIES = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    overwrite: (newValue: unknown, cachedValue: unknown) => newValue,
    keep: (newValue: unknown, cachedValue: unknown) => cachedValue
};

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
export const Storage = (options: string | StorageOptions = {}) => {
    return defineMemberDecoratorProcessor('storage', {
        afterInstantiation<T extends Record<MemberKey, unknown>>(
            instance: T,
            member: MemberKey,
            metadata: ClassMetadataReader<T>,
            container: ApplicationContext
        ) {
            // Get default options from class decorator if they exist
            const defaultOptions = getDefaultStorageOptions(metadata);

            // Merge options, with member-specific options taking precedence
            const mergedOptions: StorageOptions = {
                ...defaultOptions,
                ...(typeof options === 'string' ? { key: options } : options)
            };
            const version = mergedOptions.version ?? '';

            const descriptor = Object.getOwnPropertyDescriptor(
                instance,
                member
            );
            const writable = descriptor?.writable ?? true;

            const isSignal = isSignalMember(instance, member);
            const key = mergedOptions.key ?? member.toString();
            const bucketOrName = mergedOptions.bucket || DEFAULT_BUCKET;

            const bucket =
                typeof bucketOrName != 'object'
                    ? <Bucket>container.getInstance(bucketOrName)
                    : bucketOrName;

            const initialValue = instance[member];

            const [get, set] = (() => {
                if (isSignal) {
                    const [get, set] = getSignal(
                        instance,
                        member,
                        initialValue
                    );
                    return [get, set];
                } else {
                    const storageSymbol = Symbol(`__storage_${String(member)}`);

                    (instance as Record<symbol, unknown>)[storageSymbol] =
                        initialValue;

                    const baseGetter = () => {
                        return (instance as Record<symbol, unknown>)[
                            storageSymbol
                        ];
                    };
                    const baseSetter = (newValue: unknown) => {
                        (instance as Record<symbol, unknown>)[storageSymbol] =
                            newValue;
                    };

                    Object.defineProperty(instance, member, {
                        get: baseGetter,
                        set: baseSetter,
                        configurable: true,
                        enumerable: descriptor?.enumerable ?? true
                    });

                    return [baseGetter, baseSetter];
                }
            })();

            const observe = () => {
                return bucket.observe(key, event => {
                    if (bucket.debug) {
                        console.debug(
                            `[Storage] ${ActionType[event.action]} ${JSON.stringify(
                                {
                                    action: ActionType[event.action],
                                    changeBy: ChangeBy[event.changeBy],
                                    key: event.key,
                                    bucketName: event.target.name,
                                    newValue: event.newValue,
                                    originValue: event.originValue
                                }
                            )}`
                        );
                    }
                    set(event.newValue);

                    notifyStorageChange({
                        instance,
                        member: key,
                        ...event
                    });
                });
            };
            if (bucket.debug) {
                console.debug(`[Storage] ${key} is loaded from ${bucket.name}`);
            }
            const owner = getOwner();
            bucket
                .getItem<StorageValue>(key)
                .then(storageValue => {
                    if (bucket.debug) {
                        console.debug(
                            `[Storage] ${key} is loaded, value: ${storageValue?.$d}`
                        );
                    }
                    if (!isValidStorageValue(storageValue)) {
                        return;
                    }
                    const dataVersion = storageValue.$v;
                    if (dataVersion !== version) {
                        const mergeStrategy = mergedOptions.migrationStrategy;
                        if (
                            typeof mergeStrategy === 'string' &&
                            BUILT_IN_MIGRATION_STRATEGIES[mergeStrategy]
                        ) {
                            set(
                                BUILT_IN_MIGRATION_STRATEGIES[mergeStrategy](
                                    storageValue.$d,
                                    storageValue.$d
                                )
                            );
                        } else if (typeof mergeStrategy === 'function') {
                            set(
                                mergeStrategy(storageValue.$d, storageValue.$d)
                            );
                        }
                    } else {
                        set(storageValue.$d);
                    }

                    notifyStorageLoad({
                        instance,
                        member,
                        value: storageValue.$d,
                        timestamp: Date.now()
                    });
                })
                .then(() => {
                    runWithOwner(owner, () => {
                        let unobserve = observe();

                        if (!writable) {
                            onCleanup(() => {
                                unobserve();
                            });
                            return;
                        }

                        const trigger = createSaveTrigger(
                            unobserve,
                            () => {
                                unobserve = observe();
                            },
                            bucket,
                            key,
                            version,
                            instance,
                            member
                        );

                        setupChangeListener(
                            isSignal,
                            instance,
                            member,
                            trigger,
                            get
                        );

                        onCleanup(() => {
                            unobserve();
                        });
                    });
                });
        }
    });
};

function createSaveTrigger(
    unobserve: () => void,
    reobserve: () => void,
    bucket: Bucket,
    key: string,
    version: string,
    instance: object,
    member: MemberKey
) {
    return leadingAndTrailing(
        debounce,
        (newValue: unknown) => {
            unobserve();
            if (bucket.debug) {
                console.debug(
                    `[Storage] ${instance.constructor?.name}.${member.toString()}
                    changed to ${newValue}`.replace(/\s+/g, ' ')
                );
            }
            bucket
                .setItem(key, {
                    $d: newValue,
                    $v: version
                } satisfies StorageValue)
                .finally(() => {
                    reobserve();
                });
        },
        300
    );
}

function setupChangeListener(
    isSignal: boolean,
    instance: object,
    member: MemberKey,
    trigger: (newValue: unknown) => void,
    getValue: () => unknown
) {
    if (isSignal) {
        createEffect(
            on(() => {
                return getValue();
            }, trigger)
        );
    } else {
        const currentDescriptor = Object.getOwnPropertyDescriptor(
            instance,
            member
        );
        if (currentDescriptor) {
            const originalGetter = currentDescriptor.get;
            const originalSetter = currentDescriptor.set;
            Object.defineProperty(instance, member, {
                get: originalGetter,
                set: (newValue: unknown) => {
                    if (originalSetter) {
                        originalSetter.call(instance, newValue);
                    }
                    trigger(newValue);
                },
                configurable: currentDescriptor.configurable ?? true,
                enumerable: currentDescriptor.enumerable ?? true
            });
        }
    }
}

function isValidStorageValue(value: unknown): value is StorageValue {
    return (
        typeof value === 'object' &&
        value !== null &&
        '$d' in value &&
        '$v' in value
    );
}
