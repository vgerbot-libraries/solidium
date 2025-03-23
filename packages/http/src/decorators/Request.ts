import { RequestAdapterConstructor } from '../adapter/RequestAdapter';
import { EndpointInstance } from '../core/EndpointInstance';
import { METHODS } from '../core/EndpointMembers';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { setExecutionContext } from '../core/execution-context';
import { Interceptor, InterceptorTypeIdentifier } from '../core/Interceptor';
import { Reactive } from '../core/Reactive';
import { HttpMethod } from '../http/HttpMethod';
import { RetryConfig } from '../interceptors/RetryInterceptor';
import { EndpointMetadata } from '../metadata/EndpointMetadata';
import { RequestMethodMetadata } from '../metadata/RequestMethodMetadata';
import { AnyResource } from '../resource/Resource';

export interface RequestOptions {
    path: string;
    method: HttpMethod;
    headers?: Record<string, string | string[]>;
    interceptors?: Array<InterceptorTypeIdentifier | Interceptor>;
    excludeInterceptors?: Array<InterceptorTypeIdentifier | Interceptor>;
    timeout?: number;
    retry?: RetryConfig;
    adapter?: RequestAdapterConstructor;
    reactive?: boolean;
}
export function Request(options: RequestOptions) {
    return function decorateMethod<R, Args extends Array<Reactive<unknown>>>(
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
                const method =
                    EndpointMetadata.from(clazz).getMethodMetadata(propertyKey);
                method.setOptions(options);
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
            const methodMetadata =
                EndpointMetadata.from(clazz).getMethodMetadata(propertyKey);
            methodMetadata.setOptions(options);
            return {
                ...descriptor,
                value: delegator(
                    Reflect.get(target, propertyKey),
                    methodMetadata
                )
            };
        }

        function delegator(
            originFunction: (...args: unknown[]) => AnyResource,
            methodMetadata: RequestMethodMetadata
        ) {
            return function (this: unknown, ...args: unknown[]) {
                const params: ExecuteRequestMethodParams = {
                    headers: methodMetadata.getHeaders().clone(),
                    pathVariables: {},
                    queryParams: new URLSearchParams(),
                    adapter: methodMetadata.getAdapter()
                };
                const instance = this as EndpointInstance;
                const method = instance[METHODS].get(methodMetadata.name);
                if (!method) {
                    const error = new Error(
                        `Not found method ${methodMetadata.name.toString()}`
                    );
                    throw error;
                }
                setExecutionContext({
                    instance,
                    method,
                    params
                });
                const executionHandlers = methodMetadata.getExecutionHandlers();
                executionHandlers.forEach(handler => {
                    handler(instance, method, params, args);
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
