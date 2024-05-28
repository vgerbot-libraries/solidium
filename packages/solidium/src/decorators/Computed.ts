import { MemberKey } from '@vgerbot/ioc';
import { useComputed } from '../hooks/useComputed';
import { defineMemberDecoratorProcessor } from '../core/defineMemberDecoratorProcessor';

export const COMPUTED_GETTER_MARK_KEY = Symbol('solidium_computed_getter');

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
