import type { MemberKey } from "@vgerbot/ioc";
import { defineMemberDecoratorProcessor } from "../core/defineMemberDecoratorProcessor";
import { defineSignalMember } from "../helper/signal-member";

export const SIGNAL_MARK_KEY = Symbol("solidium_mark_as_signal_property");

/**
 * Options for the Signal decorator.
 * @experimental
 */
export type SignalOptions = object;

/**
 * Decorator that turns a class property into a reactive signal.
 *
 * When applied to a property, it replaces the property with a getter and a setter.
 * The first time the property is accessed, a SolidJS signal is created with the property's initial value.
 * Subsequent accesses will return the current value of the signal.
 * When the property is assigned a new value, the signal is updated.
 *
 * This allows other parts of the application, such as components or other reactive code,
 * to subscribe to changes in the property's value.
 *
 * Example usage:
 * ```typescript
 * class MyStore {
 *   @Signal()
 *   count = 0;
 * }
 *
 * const store = new MyStore();
 *
 * createEffect(() => {
 *   console.log('Count changed:', store.count);
 * });
 *
 * store.count = 1; // This will trigger the effect and log the new value.
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Signal(_: SignalOptions = {}) {
	return defineMemberDecoratorProcessor(SIGNAL_MARK_KEY, {
		priority: -1,
		afterInstantiation<T>(instance: T, member: MemberKey) {
			defineSignalMember(instance, member, instance[member as keyof T]);
			return instance;
		},
	});
}
