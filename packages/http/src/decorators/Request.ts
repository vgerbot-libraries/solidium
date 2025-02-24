import { RequestAdapterConstructor } from '../adapter/RequestAdapter';
import { EndpointInstance } from '../core/EndpointInstance';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { setExecutionContext } from '../core/execution-context';
import {
    Interceptor,
    InterceptorFunction,
    InterceptorTypeIdentifier
} from '../core/Interceptor';
import { HttpMethod } from '../http/HttpMethod';
import { RetryConfig } from '../interceptors/RetryInterceptor';
import { EndpointMetadata } from '../metadata/EndpointMetadata';
import { RequestMethodMetadata } from '../metadata/RequestMethodMetadata';

export interface RequestOptions {
    path: string;
    method: HttpMethod;
    headers?: Record<string, string | string[]>;
    interceptors?: Array<
        InterceptorTypeIdentifier | Interceptor | InterceptorFunction
    >;
    timeout?: number;
    retry?: RetryConfig;
    adapter?: RequestAdapterConstructor;
}
export function Request(options: RequestOptions) {
    return (
        target: EndpointInstance,
        context: ClassMethodDecoratorContext | string | symbol
    ) => {
        if (!target || !('constructor' in target)) {
            return;
        }
        const propertyKey =
            typeof context === 'object' ? context.name : context;
        const method = new RequestMethodMetadata(propertyKey, options);
        if (typeof context === 'string' || typeof context === 'symbol') {
            setupMethodMetadata();
            Reflect.defineProperty(target, propertyKey, {
                value: deletator(Reflect.get(target, context))
            });
            return;
        }
        if (context.kind !== 'method') {
            return;
        }
        setupMethodMetadata();
        return deletator(Reflect.get(target, context.name));
        function setupMethodMetadata() {
            const endpointMetadata = EndpointMetadata.from(target.constructor);
            endpointMetadata.setMethodMetadata(propertyKey, method);
        }
        function deletator(originFunction: Function) {
            return function (this: EndpointInstance, ...args: unknown[]) {
                const params: ExecuteRequestMethodParams = {
                    headers: method.getHeaders().clone(),
                    pathVariables: {},
                    queryParams: {},
                    adapter: method.getAdapter()
                };
                setExecutionContext({
                    instance: this,
                    method,
                    params
                });
                return originFunction.apply(this, args);
            };
        }
    };
}
export function createRequestDecorator(
    options: string | Omit<RequestOptions, 'method'>,
    method: HttpMethod
) {
    if (typeof options === 'string') {
        return Request({
            path: options,
            method
        });
    } else {
        return Request({
            ...options,
            method
        });
    }
}
