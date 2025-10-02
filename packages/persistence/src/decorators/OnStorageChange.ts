import { ChangeEvent } from '../core/bucket/ChangeEvent';
import { ActionType } from '../types/ActionType';
import { ChangeBy } from '../types/ChangeBy';

/**
 * Event object passed to `@OnStorageChange` decorated methods.
 * Extends {@link ChangeEvent} with additional context about the instance and property.
 * 
 * @typeParam T - The type of the class instance
 * 
 * @public
 */
export interface StorageChangeEvent<T> extends ChangeEvent {
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
export type StorageChangeEventListener<T> = (event: StorageChangeEvent<T>) => void;

const STORAGE_CHANGE_EVENTS = Symbol('storage-change-events');

/**
 * Internal function to notify all registered storage change listeners.
 * @internal
 */
export function notifyStorageChange<T>(event: StorageChangeEvent<T>) {
    const prototype = Object.getPrototypeOf(event.instance);
    const events: StorageChangeEventListener<T>[] =
        Reflect.getMetadata(STORAGE_CHANGE_EVENTS, prototype) ?? [];
    events.forEach(handle => {
        handle.call(event.instance, event);
    });
}

/**
 * Configuration options for the OnStorageChange decorator.
 * Allows filtering which storage changes trigger the decorated method.
 * 
 * @public
 */
export interface StorageChangeNotifyOptions {
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
export function OnStorageChange(options?: StorageChangeNotifyOptions) {

    return <T extends object>(target: T, propertyKey: PropertyKey) => {
        const events: StorageChangeEventListener<T>[] =
            Reflect.getMetadata(STORAGE_CHANGE_EVENTS, target) ?? [];
        Reflect.defineMetadata(STORAGE_CHANGE_EVENTS, events, target);

        events.push(function listener<T>(this: T, event: StorageChangeEvent<T>) {
            if (options?.members && !options.members.includes(event.member)) {
                return;
            }
            if (options?.changeBy && event.changeBy !== options.changeBy) {
                return;
            }

            if (options?.action && event.action !== options.action) {
                return;
            }

            const method = Reflect.get(
                this as object,
                propertyKey
            ) as StorageChangeEventListener<T>;
            method.call(this, event);
        })
    };
}