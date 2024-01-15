import { MemberKey } from '@vgerbot/ioc';
import { InterceptorFunction, interceptor } from '../common/interceptor';

export const SETTER_INTERCEPTOR_MAP_KEY = Symbol(
    'solidium-setter-interceptors-map'
);

export interface SetterInterceptorTarget<T> {
    [SETTER_INTERCEPTOR_MAP_KEY]:
        | Map<MemberKey, InterceptorFunction<T>>
        | undefined;
}

export type SetterInterceptorOptions = {
    key: string | symbol;
};

export function appendSetterInterceptor<T>(
    target: SetterInterceptorTarget<T>,
    options: SetterInterceptorOptions,
    interceptorMethodName: MemberKey
) {
    let interceptorsMap = target[SETTER_INTERCEPTOR_MAP_KEY];
    if (!interceptorsMap) {
        interceptorsMap = new Map<MemberKey, InterceptorFunction<T>>();
        Object.defineProperty(target, SETTER_INTERCEPTOR_MAP_KEY, {
            value: interceptorsMap,
            enumerable: false,
            writable: false,
            configurable: false
        });
    }
    const leftInterceptor = interceptorsMap.get(options.key);
    const newInterceptor = interceptor(
        leftInterceptor,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (target as any)[interceptorMethodName]
    );
    interceptorsMap.set(options.key, newInterceptor);
}
