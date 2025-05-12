import { decorateEndpointMethod } from '../helper/decorateEndpointMethod';
import { RequestAdapterConstructor } from '../adapter/RequestAdapter';
import { EndpointInstance } from '../core/EndpointInstance';
import { METHODS } from '../core/EndpointMembers';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { setExecutionContext } from '../core/execution-context';
import { Interceptor, InterceptorTypeIdentifier } from '../core/Interceptor';
import { HttpMethod } from '../http/HttpMethod';
import { RetryConfig } from '../interceptors/RetryInterceptor';
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
    return decorateEndpointMethod(
        (
            clazz: NewableFunction,
            methodName: string | symbol,
            methodMetadata: RequestMethodMetadata
        ) => {
            methodMetadata.setOptions(options);
            return {
                value: delegator(
                    Reflect.get(clazz.prototype, methodName),
                    methodMetadata
                )
            };
        }
    );
    function delegator(
        originFunction: (...args: unknown[]) => AnyResource,
        methodMetadata: RequestMethodMetadata
    ) {
        return function (this: unknown, ...args: unknown[]) {
            const params: ExecuteRequestMethodParams = {
                method: methodMetadata.getHttpMethod(),
                headers: methodMetadata.getHeaders().clone(),
                pathVariables: {},
                queryParams: new URLSearchParams(),
                adapter: methodMetadata.getAdapter(),
                args
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
            return originFunction.apply(this, args);
        };
    }
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
