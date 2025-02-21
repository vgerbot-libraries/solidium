import { MemberKey } from '@vgerbot/ioc';
import { defineSignalMember } from '../helper/defineSignalMember';
import { defineMemberDecoratorProcessor } from '../core/defineMemberDecoratorProcessor';

export const SIGNAL_MARK_KEY = Symbol('solidium_mark_as_signal_property');

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SignalOptions {
    // IGNORE
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Signal(_: SignalOptions = {}) {
    return defineMemberDecoratorProcessor(SIGNAL_MARK_KEY, {
        afterInstantiation<T>(instance: T, member: MemberKey) {
            defineSignalMember(instance, member, instance[member as keyof T]);
            return instance;
        }
    });
}
