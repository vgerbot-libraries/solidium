import {
    RequestAdapterConstructor,
    RequestAdapterFactory
} from '../adapter/RequestAdapter';
import {
    InterceptorConstructor,
    InterceptorFunction
} from '../core/Interceptor';
import { HttpMethod } from '../http/HttpMethod';

export interface RequestOptions {
    path: string;
    method: HttpMethod;
    headers?: Record<string, string | string[]>;
    interceptors?: Array<
        InterceptorFunction | InterceptorConstructor | string | symbol
    >;
    timeout?: number;
    adapter?:
        | RequestAdapterConstructor
        | RequestAdapterFactory
        | string
        | symbol;
}
export function Request(options: RequestOptions) {
    return <T>(
        target: Object,
        context: ClassMethodDecoratorContext | string | symbol
    ) => {
        if (typeof context === 'string' || typeof context === 'symbol') {
            // TODO: experimental decorator
            return;
        }
        if (context.kind !== 'method') {
            return;
        }
        function deletator() {
            //
        }
        return deletator;
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
