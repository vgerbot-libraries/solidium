import { RequestAdapterConstructor } from '../adapter/RequestAdapter';
import { EndpointInstance } from '../core/EndpointInstance';
import { Interceptor, InterceptorFunction, InterceptorTypeIdentifier } from '../core/Interceptor';
import { HttpMethod } from '../http/HttpMethod';
import { RetryConfig } from '../interceptors/RetryInterceptor';
export interface RequestOptions {
    path: string;
    method: HttpMethod;
    headers?: Record<string, string | string[]>;
    interceptors?: Array<InterceptorTypeIdentifier | Interceptor | InterceptorFunction>;
    timeout?: number;
    retry?: RetryConfig;
    adapter?: RequestAdapterConstructor;
}
export declare function Request(options: RequestOptions): (target: EndpointInstance, context: ClassMethodDecoratorContext | string | symbol) => ((this: EndpointInstance, ...args: unknown[]) => any) | undefined;
export declare function createRequestDecorator(options: string | Omit<RequestOptions, 'method'>, method: HttpMethod): (target: EndpointInstance, context: ClassMethodDecoratorContext | string | symbol) => ((this: EndpointInstance, ...args: unknown[]) => any) | undefined;
