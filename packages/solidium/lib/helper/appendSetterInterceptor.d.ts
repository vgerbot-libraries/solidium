import { MemberKey } from '@vgerbot/ioc';
import { InterceptorFunction } from '../common/interceptor';
export declare const SETTER_INTERCEPTOR_MAP_KEY: unique symbol;
export interface SetterInterceptorTarget<T> {
    [SETTER_INTERCEPTOR_MAP_KEY]: Map<MemberKey, InterceptorFunction<T>> | undefined;
}
export type SetterInterceptorOptions = {
    key: string | symbol;
};
export declare function appendSetterInterceptor<T>(target: SetterInterceptorTarget<T>, options: SetterInterceptorOptions, interceptorMethodName: MemberKey): void;
