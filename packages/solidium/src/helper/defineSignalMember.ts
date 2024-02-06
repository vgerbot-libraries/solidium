import { MemberKey } from '@vgerbot/ioc';
import { SignalMap } from '../common/SignalMap';
import { extraDataOf } from '../common/metadata';
import {
    SETTER_INTERCEPTOR_MAP_KEY,
    SetterInterceptorTarget
} from './appendSetterInterceptor';

const signalMap = new SignalMap();

const IS_SIGNAL_MEMBER_METADATA_KEY = 'is_signal_member_metadata_key';

export function defineSignalMember<T>(
    target: T,
    member: MemberKey,
    defaultValue?: unknown
) {
    const descriptor = Object.getOwnPropertyDescriptor(target, member);
    const hasGetter = !!descriptor?.get;
    const hasSetter = !!descriptor?.set;
    if (hasGetter || hasSetter) {
        return;
    }
    const _isSignalMember = isSignalMember(target, member);
    if (_isSignalMember) {
        return;
    }
    const extraDataOfMember = extraDataOf(target as Object, member);
    extraDataOfMember?.set(IS_SIGNAL_MEMBER_METADATA_KEY, true);

    defaultValue = arguments.length === 3 ? defaultValue : descriptor?.value;

    Object.defineProperty(target, member, {
        get: function () {
            const [get] = signalMap.get(this, member, defaultValue);
            return get();
        },
        set: function (newValue) {
            const [get, set] = signalMap.get(this, member);
            const interceptorMap = (target as SetterInterceptorTarget<T>)[
                SETTER_INTERCEPTOR_MAP_KEY
            ];
            const interceptor = interceptorMap?.get(member);
            return set(
                interceptor ? interceptor.call(this, get(), newValue) : newValue
            );
        }
    });
}

export function isSignalMember<T>(target: T, member: MemberKey) {
    const extraDataOfMember = extraDataOf(target as Object, member);
    return !!extraDataOfMember?.get(IS_SIGNAL_MEMBER_METADATA_KEY);
}
