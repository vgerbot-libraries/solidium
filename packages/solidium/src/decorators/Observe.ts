import { Mark, MemberKey } from '@vgerbot/ioc';
import {
    MemberDecoratorProcessor,
    IS_MEMBER_DECORATOR_PROCESSOR
} from '../core/DecoratorProcessor';
import { createEffect, on, onCleanup } from 'solid-js';
import { clean, store } from '../common/store-result';

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
    | {}
    | DependencyObserverOptions<T>
    | ScheduledObserverOptions;
interface ObserverableObject {
    [key: MemberKey]: () => unknown;
}

export function Observe<T>(
    options: DependencyObserverOptions<T>
): MethodDecorator;
export function Observe(options: ScheduledObserverOptions): MethodDecorator;
export function Observe(options?: {}): MethodDecorator;
/**
 *
 * @param options optional
 * @returns an method decorator
 */
export function Observe<T>(options: ObserveOptions<T> = {}) {
    return Mark(OBSERVE_PROPERTY_MARK_KEY, {
        [IS_MEMBER_DECORATOR_PROCESSOR]: true,
        afterInstantiation(instance, methodName) {
            // TODO: supports scheduling
            const fn = () => {
                const ret = (instance as ObserverableObject)[methodName].call(
                    instance
                );
                store(instance as Object, methodName, ret);
                onCleanup(() => {
                    clean(instance as Object, methodName);
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
    } as MemberDecoratorProcessor) as MethodDecorator;
}
