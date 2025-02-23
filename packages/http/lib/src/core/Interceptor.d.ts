import { ExecuteRequestMethodParams } from './ExecuteRequestParams';
import { HttpResponse } from './HttpResponse';
import { RequestMethod } from './RequestMethod';
export interface Interceptor {
    invoke(method: RequestMethod, params: ExecuteRequestMethodParams, next: InterceptorNextFunction): Promise<HttpResponse>;
}
export type InterceptorConstructor = new () => Interceptor;
export type InterceptorFunction = Interceptor['invoke'];
export type InterceptorNextFunction = (method: RequestMethod, params: ExecuteRequestMethodParams) => Promise<HttpResponse>;
export declare function isInterceptorFunction(value: unknown): value is InterceptorFunction;
export declare function isInterceptorConstructor(value: unknown): value is InterceptorConstructor;
export declare function isInterceptor(value: unknown): value is Interceptor;
export type InterceptorTypeIdentifier = InterceptorConstructor | string | symbol;
