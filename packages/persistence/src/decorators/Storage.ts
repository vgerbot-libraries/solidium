import { defineMemberDecoratorProcessor, getSignal } from '@vgerbot/solidium';
import { createEffect, getOwner, on, onCleanup, runWithOwner } from 'solid-js';
import {
    ApplicationContext,
    ClassMetadataReader,
    MemberKey
} from '@vgerbot/ioc';
import { Data } from '../types/Data';
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

            const descriptor = Object.getOwnPropertyDescriptor(
                instance,
                member
            );
            const writable = descriptor?.writable ?? true;

            const [, set] = getSignal(instance, member, descriptor?.value);
            const key = mergedOptions.key ?? member.toString();
            const bucketOrName = mergedOptions.bucket || DEFAULT_BUCKET;

            const bucket =
                typeof bucketOrName != 'object'
                    ? <Bucket>container.getInstance(bucketOrName)
                    : bucketOrName;
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
                .getItem(key)
                .then(value => {
                    if (bucket.debug) {
                        console.debug(
                            `[Storage] ${key} is loaded, value: ${value}`
                        );
                    }
                    if (value !== null && value !== undefined) {
                        set(value);
                        notifyStorageLoad({
                            instance,
                            member,
                            value,
                            timestamp: Date.now()
                        });
                    }
                })
                .then(() => {
                    runWithOwner(owner, () => {
                        let unobserve = observe();
                        if (writable) {
                            createEffect(
                                on(
                                    () => {
                                        return instance[member];
                                    },
                                    newValue => {
                                        unobserve();
                                        if (bucket.debug) {
                                            console.debug(
                                                `[Storage] ${instance.constructor.name}.${member.toString()}
                                            changed to ${newValue}`.replace(
                                                    /\s+/g,
                                                    ' '
                                                )
                                            );
                                        }
                                        bucket
                                            .setItem(key, newValue as Data)
                                            .finally(() => {
                                                unobserve = observe();
                                            });
                                    }
                                )
                            );
                        }

                        onCleanup(() => {
                            unobserve();
                        });
                    });
                });
        }
    });
};
