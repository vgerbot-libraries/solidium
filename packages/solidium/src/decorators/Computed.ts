import { MemberKey } from '@vgerbot/ioc';
import { useComputed } from '../hooks/useComputed';
import { defineMemberDecoratorProcessor } from '../core/defineMemberDecoratorProcessor';

export const COMPUTED_GETTER_MARK_KEY = Symbol('solidium_computed_getter');

/**
 * A property decorator that transforms a class getter into a memoized,
 * lazily-evaluated computed property.
 *
 * The decorated getter will be converted into a `solid-js` memo under the hood,
 * but it will not be evaluated until it's accessed for the first time.
 * Once evaluated, its value is cached and will only be re-calculated when its
 * underlying reactive dependencies change.
 *
 * This decorator should only be applied to getter methods without a corresponding
 * setter.
 *
 * @example
 * ```ts
 * class MyStore {
 *   @Signal
 *   firstName = 'John';
 *
 *   @Signal
 *   lastName = 'Doe';
 *
 *   @Computed
 *   get fullName() {
 *     console.log('Computing fullName...');
 *     return `${this.firstName} ${this.lastName}`;
 *   }
 * }
 *
 * const store = useService(MyStore);
 * // At this point, 'Computing fullName...' has not been logged.
 *
 * console.log(store.fullName); // Logs 'Computing fullName...' and then 'John Doe'
 * console.log(store.fullName); // Logs 'John Doe' directly from cache.
 *
 * store.firstName = 'Jane';
 * // The value is now stale, but re-computation is deferred.
 *
 * console.log(store.fullName); // Logs 'Computing fullName...' and then 'Jane Doe'
 * ```
 */
export const Computed = defineMemberDecoratorProcessor(
    COMPUTED_GETTER_MARK_KEY,
    {
        afterInstantiation: <T>(instance: T, member: MemberKey): T => {
            const prototype = Object.getPrototypeOf(instance);
            const descriptor = Object.getOwnPropertyDescriptor(
                prototype,
                member
            );
            const originGetter = descriptor?.get;
            const hasGetter = !!originGetter;
            const hasSetter = !!descriptor?.set;
            if (!hasGetter) {
                // WARNING
                return instance;
            }
            if (hasSetter) {
                // WARNING
                return instance;
            }

            const getter = useComputed(() => descriptor?.get?.call(instance));

            Object.defineProperty(instance, member, {
                ...descriptor,
                get: getter
            });
            return instance;
        }
    }
) as PropertyDecorator;
