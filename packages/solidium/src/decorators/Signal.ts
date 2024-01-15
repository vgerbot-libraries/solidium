import { Mark, MemberKey, Newable } from '@vgerbot/ioc';
import {
    MemberDecoratorHandler,
    IS_MEMBER_DECORATOR_HANDLER
} from '../core/DecoratorHandler';
import { defineSignalMember } from '../helper/defineSignalMember';

export const SIGNAL_MARK_KEY = Symbol('solidium_mark_as_signal_property');

export const Signal = Mark(SIGNAL_MARK_KEY, {
    [IS_MEMBER_DECORATOR_HANDLER]: true,
    beforeInstantiation: function <T>(
        constructor: Newable<T>,
        member: MemberKey
    ) {
        defineSignalMember(constructor.prototype, member);
    }
} as MemberDecoratorHandler) as PropertyDecorator;
