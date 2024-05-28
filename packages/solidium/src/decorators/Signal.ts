import { MemberKey } from '@vgerbot/ioc';
import { defineSignalMember } from '../helper/defineSignalMember';
import { defineMemberDecoratorProcessor } from '../core/defineMemberDecoratorProcessor';

export const SIGNAL_MARK_KEY = Symbol('solidium_mark_as_signal_property');

export const Signal = defineMemberDecoratorProcessor(SIGNAL_MARK_KEY, {
    afterInstantiation<T>(instance: T, member: MemberKey) {
        defineSignalMember(instance, member, instance[member as keyof T]);
        return instance;
    }
});
