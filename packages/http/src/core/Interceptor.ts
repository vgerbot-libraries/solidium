import { ExecuteRequestMethodParams } from './ExecuteRequestParams';
import { HttpResponse } from './HttpResponse';
import { RequestMethod } from './RequestMethod';

export interface Interceptor {
    invoke(
        method: RequestMethod,
        params: ExecuteRequestMethodParams,
        next: InterceptorNextFunction
    ): Promise<HttpResponse>;
}
export type InterceptorConstructor = new () => Interceptor;

export type InterceptorNextFunction = (
    method: RequestMethod,
    params: ExecuteRequestMethodParams
) => Promise<HttpResponse>;

export function isInterceptorConstructor(
    value: unknown
): value is InterceptorConstructor {
    return (
        typeof value === 'function' &&
        typeof value.prototype['invoke'] === 'function'
    );
}
export function isInterceptor(value: unknown): value is Interceptor {
    return (
        typeof value === 'object' &&
        !!value &&
        'invoke' in value &&
        typeof value['invoke'] === 'function'
    );
}
export type InterceptorTypeIdentifier =
    | InterceptorConstructor
    | string
    | symbol;
