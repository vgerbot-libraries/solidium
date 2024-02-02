import { Mark, MemberKey } from '@vgerbot/ioc';
import {
    MemberDecoratorProcessor,
    IS_MEMBER_DECORATOR_PROCESSOR
} from '../core/DecoratorProcessor';
import { createEffect, onCleanup } from 'solid-js';
import { clean, store } from '../common/store-result';

export const OBSERVE_PROPERTY_MARK_KEY = Symbol('solidium_observed_property');
export type ObserveOptions = {
    collectOnce?: boolean;
    schedule?:
        | undefined
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

export const Observe = (options: ObserveOptions = { collectOnce: false }) =>
    Mark(OBSERVE_PROPERTY_MARK_KEY, {
        [IS_MEMBER_DECORATOR_PROCESSOR]: true,
        afterInstantiation(instance, methodName) {
            // TODO: supports scheduling
            createEffect(() => {
                const ret = (instance as ObserverableObject)[methodName].call(
                    instance
                );
                store(instance as Object, methodName, ret);
                onCleanup(() => {
                    clean(instance as Object, methodName);
                });
            });
            return instance;
        }
    } as MemberDecoratorProcessor) as MethodDecorator;
