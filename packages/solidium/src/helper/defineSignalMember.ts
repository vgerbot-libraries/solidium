import { MemberKey } from '@vgerbot/ioc';
import { SignalMap } from '../common/SignalMap';
import {
    SETTER_INTERCEPTOR_MAP_KEY,
    SetterInterceptorTarget
} from '../decorators/SetterInterceptor';

const signalMap = new SignalMap();
export function defineSignalMember<T>(target: T, member: MemberKey) {
    const descriptor = Object.getOwnPropertyDescriptor(target, member);
    const hasGetter = !!descriptor?.get;
    const hasSetter = !!descriptor?.set;
    if (hasGetter || hasSetter) {
        return;
    }
    Object.defineProperty(target, member, {
        get: function () {
            const [get] = signalMap.get(this, member, descriptor?.value);
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
