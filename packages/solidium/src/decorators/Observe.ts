import { MemberKey } from '@vgerbot/ioc';
import { createEffect, on, onCleanup } from 'solid-js';
import { clean, store } from '../common/store-result';
import { defineMemberDecoratorProcessor } from '../core/defineMemberDecoratorProcessor';

export const OBSERVE_PROPERTY_MARK_KEY = Symbol('solidium_observed_property');

type DependencyObserverOptions<T> = {
    deps: Array<(this: T) => unknown>;
    defer?: boolean;
};

type ScheduledObserverOptions = {
    schedule:
        | {
              mode: 'throttle';
              trailing?: boolean;
              leading?: boolean;
              wait?: number;
          }
        | {
              mode: 'debounce';
              trailing?: boolean;
              leading?: boolean;
              wait?: number;
              maxWait?: number;
          };
};

export type ObserveOptions<T> =
    | object
    | DependencyObserverOptions<T>
    | ScheduledObserverOptions;
interface ObserverableObject {
    [key: MemberKey]: () => unknown;
}

export function Observe<T>(
    options: DependencyObserverOptions<T>
): MethodDecorator;
export function Observe(options: ScheduledObserverOptions): MethodDecorator;

export function Observe(options?: object): MethodDecorator;
/**
 *
 * @param options optional
 * @returns an method decorator
 */
export function Observe<T>(options: ObserveOptions<T> = {}) {
    return defineMemberDecoratorProcessor<ObserverableObject>(
        OBSERVE_PROPERTY_MARK_KEY,
        {
            afterInstantiation(instance, methodName) {
                // TODO: supports scheduling
                const fn = () => {
                    const ret = instance[methodName].call(instance);

                    store(instance as object, methodName, ret);
                    onCleanup(() => {
                        clean(instance as object, methodName);
                    });
                };
                if ('deps' in options) {
                    createEffect(
                        on(options.deps, fn, {
                            defer: options.defer
                        })
                    );
                } else {
                    createEffect(fn);
                }
                return instance;
            }
        }
    ) as MethodDecorator;
}
