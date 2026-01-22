/**
 * Event object passed to `@OnStorageLoad` decorated methods.
 *
 * @typeParam T - The type of the class instance
 * @typeParam D - The type of the loaded data
 *
 * @public
 */
export interface StorageLoadEvent<T, D = unknown> {
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
export type InternalStorageLoadEvent<T> = Omit<
	StorageLoadEvent<T>,
	"loadedMembers"
>;
/**
 * Type definition for storage load event listener functions.
 *
 * @public
 */
export type StorageLoadEventListener = <T>(event: StorageLoadEvent<T>) => void;
/**
 * @internal
 */
export type InternalStorageLoadEventListener = <T>(
	event: InternalStorageLoadEvent<T>,
) => void;

const STORAGE_LOAD_EVENTS = Symbol();

export function notifyStorageLoad<T>(event: InternalStorageLoadEvent<T>) {
	const prototype = Object.getPrototypeOf(event.instance);
	const events: InternalStorageLoadEventListener[] =
		Reflect.getMetadata(STORAGE_LOAD_EVENTS, prototype) ?? [];
	events.forEach((handle) => {
		handle.call(event.instance, event);
	});
}

/**
 * Configuration options for the OnStorageLoad decorator.
 *
 * @public
 */
export interface StorageLoadNotifyOptions {
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
export function OnStorageLoad(options?: StorageLoadNotifyOptions) {
	return <T extends object>(target: T, propertyKey: PropertyKey) => {
		const events: InternalStorageLoadEventListener[] =
			Reflect.getMetadata(STORAGE_LOAD_EVENTS, target) ?? [];
		Reflect.defineMetadata(STORAGE_LOAD_EVENTS, events, target);

		const loadedMembers = new Set<PropertyKey>();
		events.push(function listener<T>(
			this: T,
			event: InternalStorageLoadEvent<T>,
		) {
			loadedMembers.add(event.member);
			if (options?.members && !options.members.includes(event.member)) {
				return;
			}
			const method = Reflect.get(
				this as object,
				propertyKey,
			) as StorageLoadEventListener;
			method.call(this, {
				...event,
				loadedMembers: new Set(loadedMembers),
			});
			if (options?.members) {
				const isAllHandled = loadedMembers.isSupersetOf(
					new Set(options.members),
				);
				if (isAllHandled) {
					const index = events.indexOf(listener);
					if (index === -1) {
						return;
					}
					const newEvents = events.slice(0).splice(index, 1);
					Reflect.defineMetadata(STORAGE_LOAD_EVENTS, newEvents, target);
				}
			}
		});
	};
}
