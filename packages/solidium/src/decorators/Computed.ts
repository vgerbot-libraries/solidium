import { Mark, MemberKey } from '@vgerbot/ioc';
import {
    MemberDecoratorHandler,
    IS_MEMBER_DECORATOR_HANDLER
} from '../core/DecoratorHandler';
import { useComputed } from '../hooks/useComputed';

export const COMPUTED_GETTER_MARK_KEY = Symbol('solidium_computed_getter');

export const Computed = Mark(COMPUTED_GETTER_MARK_KEY, {
    [IS_MEMBER_DECORATOR_HANDLER]: true,
    afterInstantiation: <T>(instance: T, member: MemberKey): T => {
        const prototype = Object.getPrototypeOf(instance);
        const descriptor = Object.getOwnPropertyDescriptor(prototype, member);
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
} as MemberDecoratorHandler) as PropertyDecorator;
