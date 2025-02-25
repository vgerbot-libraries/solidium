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
import { AnyResource } from '../resource/Resource';

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
    return function decorateMethod<R, Args extends unknown[]>(
        target: object | ((...args: Args) => R),
        context:
            | ClassMethodDecoratorContext<object, (...args: Args) => R>
            | string
            | symbol,
        descriptor?: TypedPropertyDescriptor<(...args: Args) => R>
    ) {
        if (typeof target === 'function' && typeof context === 'object') {
            const propertyKey = context.name;
            context.addInitializer(function () {
                const clazz = this.constructor;
                const method = new RequestMethodMetadata(propertyKey, options);
                EndpointMetadata.from(clazz).setMethodMetadata(
                    propertyKey,
                    method
                );
                Reflect.set(
                    this,
                    propertyKey,
                    delegator(Reflect.get(this, propertyKey), method)
                );
            });
        } else if (
            typeof target === 'object' &&
            typeof context !== 'object' &&
            typeof descriptor === 'object'
        ) {
            const propertyKey = context;
            const clazz = target.constructor;
            const method = new RequestMethodMetadata(propertyKey, options);
            EndpointMetadata.from(clazz).setMethodMetadata(propertyKey, method);
            return {
                ...descriptor,
                value: delegator(Reflect.get(target, propertyKey), method)
            };
        }

        function delegator(
            originFunction: (...args: unknown[]) => AnyResource,
            method: RequestMethodMetadata
        ) {
            return function (this: unknown, ...args: unknown[]) {
                const params: ExecuteRequestMethodParams = {
                    headers: method.getHeaders().clone(),
                    pathVariables: {},
                    queryParams: new URLSearchParams(),
                    adapter: method.getAdapter()
                };
                setExecutionContext({
                    instance: this as EndpointInstance,
                    method,
                    params
                });
                return originFunction.apply(this, args) as R;
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
