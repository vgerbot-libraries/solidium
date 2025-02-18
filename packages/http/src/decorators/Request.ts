import { RequestAdapterConstructor } from '../adapter/RequestAdapter';
import { EndpointInstance } from '../core/buildEndpointClass';
import { executeReques } from '../core/executeRequest';
import {
    InterceptorConstructor,
    InterceptorFunction
} from '../core/Interceptor';
import { HttpMethod } from '../http/HttpMethod';
import { EndpointMetadata } from '../metadata/EndpointMetadata';
import { RequestMethodMetadata } from '../metadata/RequestMethodMetadata';

export interface RequestOptions {
    path: string;
    method: HttpMethod;
    headers?: Record<string, string | string[]>;
    interceptors?: Array<
        InterceptorFunction | InterceptorConstructor | string | symbol
    >;
    timeout?: number;
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
        const method = new RequestMethodMetadata(options);
        const propertyKey =
            typeof context === 'object' ? context.name : context;
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
                return executeReques(this, method, args, originFunction);
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
