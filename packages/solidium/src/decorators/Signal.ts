import { Mark, MemberKey, Newable } from '@vgerbot/ioc';
import {
    MemberDecoratorProcessor,
    IS_MEMBER_DECORATOR_PROCESSOR
} from '../core/DecoratorProcessor';
import { defineSignalMember } from '../helper/defineSignalMember';

export const SIGNAL_MARK_KEY = Symbol('solidium_mark_as_signal_property');

export const Signal = Mark(SIGNAL_MARK_KEY, {
    [IS_MEMBER_DECORATOR_PROCESSOR]: true,
    beforeInstantiation: function <T>(
        constructor: Newable<T>,
        member: MemberKey
    ) {
        defineSignalMember(constructor.prototype, member);
    }
} as MemberDecoratorProcessor) as PropertyDecorator;
