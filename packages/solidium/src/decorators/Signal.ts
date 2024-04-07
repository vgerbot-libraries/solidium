import { Mark, MemberKey } from '@vgerbot/ioc';
import {
    MemberDecoratorProcessor,
    IS_MEMBER_DECORATOR_PROCESSOR
} from '../core/DecoratorProcessor';
import { defineSignalMember } from '../helper/defineSignalMember';

export const SIGNAL_MARK_KEY = Symbol('solidium_mark_as_signal_property');

export const Signal = Mark(SIGNAL_MARK_KEY, {
    [IS_MEMBER_DECORATOR_PROCESSOR]: true,
    afterInstantiation<T>(instance: T, member: MemberKey) {
        defineSignalMember(instance, member, instance[member as keyof T]);
        return instance;
    }
} as MemberDecoratorProcessor) as PropertyDecorator;
