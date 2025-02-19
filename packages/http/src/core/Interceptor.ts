import { ExecuteRequestMethodParams } from './ExecuteRequestParams';
import { HttpResponse } from './HttpResponse';
import { RequestMethod } from './RequestMethod';

export interface Interceptor {
    invoke(
        method: RequestMethod,
        params: ExecuteRequestMethodParams,
        next: (
            method: RequestMethod,
            params: ExecuteRequestMethodParams
        ) => Promise<HttpResponse>
    ): Promise<HttpResponse>;
}
export type InterceptorConstructor = new () => Interceptor;

export type InterceptorFunction = Interceptor['invoke'];

export function isInterceptorFunction(
    value: unknown
): value is InterceptorFunction {
    return (
        typeof value === 'function' &&
        typeof value.prototype['invoke'] !== 'function'
    );
}
export function isInterceptorConstructor(
    value: unknown
): value is InterceptorConstructor {
    return (
        typeof value === 'function' &&
        typeof value.prototype['invoke'] === 'function'
    );
}
export type InterceptorTypeIdentifier =
    | InterceptorConstructor
    | string
    | symbol;
