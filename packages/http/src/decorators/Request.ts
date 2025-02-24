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
    return function decorateMethod(
        target: object,
        context:
            | ClassMethodDecoratorContext<
                  object,
                  (...args: unknown[]) => AnyResource
              >
            | string
            | symbol
    ) {
        if (!target || !('constructor' in target)) {
            return;
        }
        const propertyKey =
            typeof context === 'object' ? context.name : context;
        const method = new RequestMethodMetadata(propertyKey, options);
        if (typeof context === 'string' || typeof context === 'symbol') {
            setupMethodMetadata();
            Reflect.defineProperty(target, propertyKey, {
                configurable: false,
                value: delegator(Reflect.get(target, context))
            });
            return;
        }
        if (context.kind !== 'method') {
            return;
        }
        setupMethodMetadata();
        Object.defineProperty(target, context.name, {
            configurable: false,
            enumerable: true,
            writable: false,
            value: delegator(Reflect.get(target, context.name))
        });
        function setupMethodMetadata() {
            const endpointMetadata = EndpointMetadata.from(target.constructor);
            endpointMetadata.setMethodMetadata(propertyKey, method);
        }
        function delegator(originFunction: Function) {
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
                return originFunction.apply(this, args) as AnyResource;
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
