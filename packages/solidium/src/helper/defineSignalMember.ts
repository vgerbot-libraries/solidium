import { MemberKey } from '@vgerbot/ioc';
import { SignalMap } from '../common/SignalMap';
import { extraDataOf } from '../common/metadata';
import {
    SETTER_INTERCEPTOR_MAP_KEY,
    SetterInterceptorTarget
} from './appendSetterInterceptor';
import {
    SetterInterceptorFunction,
    combineSetterInterceptor
} from '../common/interceptor';
import { getOwner, runWithOwner, Signal } from 'solid-js';

const signalMap = new SignalMap();

const IS_SIGNAL_MEMBER_METADATA_KEY = 'is_signal_member_metadata_key';

export function defineSignalMember<T>(
    target: T,
    member: MemberKey,
    defaultValue?: unknown,
    interceptors?: {
        getter?: (this: T, value: unknown) => unknown;
        setter?: (this: T, oldValue?: unknown, newValue?: unknown) => unknown;
    }
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
    const extraDataOfMember = extraDataOf(target as object, member);
    extraDataOfMember?.set(IS_SIGNAL_MEMBER_METADATA_KEY, true);

    defaultValue = arguments.length === 3 ? defaultValue : descriptor?.value;
    const owner = getOwner();
    Object.defineProperty(target, member, {
        get: function () {
            const [get] = runWithOwner(owner, () => {
                return signalMap.get(this, member, defaultValue);
            }) as Signal<unknown>;
            if (interceptors?.getter) {
                return interceptors.getter.call(this, get());
            }
            return get();
        },
        set: function (newValue) {
            const [get, set] = runWithOwner(owner, () => {
                return signalMap.get(this, member);
            }) as Signal<unknown>;
            const interceptorMap = (target as SetterInterceptorTarget<T>)[
                SETTER_INTERCEPTOR_MAP_KEY
            ];
            let interceptor: SetterInterceptorFunction<T> | undefined;
            const setterInterceptor = interceptorMap?.get(member);
            if (setterInterceptor && interceptors?.setter) {
                interceptor = combineSetterInterceptor(
                    setterInterceptor,
                    interceptors.setter
                );
            } else {
                interceptor = setterInterceptor || interceptors?.setter;
            }
            set(
                interceptor ? interceptor.call(this, get(), newValue) : newValue
            );
        }
    });
}

export function isSignalMember<T>(target: T, member: MemberKey) {
    const extraDataOfMember = extraDataOf(target as object, member);
    return !!extraDataOfMember?.get(IS_SIGNAL_MEMBER_METADATA_KEY);
}

export function getSignal<T>(
    instance: T,
    member: MemberKey,
    initializeValue?: unknown
) {
    return signalMap.get(instance as object, member, initializeValue);
}
