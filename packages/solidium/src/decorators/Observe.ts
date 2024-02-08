import { Mark, MemberKey } from '@vgerbot/ioc';
import {
    MemberDecoratorProcessor,
    IS_MEMBER_DECORATOR_PROCESSOR
} from '../core/DecoratorProcessor';
import { AccessorArray, createEffect, on, onCleanup } from 'solid-js';
import { clean, store } from '../common/store-result';

export const OBSERVE_PROPERTY_MARK_KEY = Symbol('solidium_observed_property');
export type ObserveOptions =
    | {}
    | {
          deps: AccessorArray<unknown>;
          defer?: boolean;
      }
    | {
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
interface ObserverableObject {
    [key: MemberKey]: () => unknown;
}
/**
 *
 * @param options optional
 * @returns an method decorator
 */
export const Observe = (options: ObserveOptions = {}) =>
    Mark(OBSERVE_PROPERTY_MARK_KEY, {
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
