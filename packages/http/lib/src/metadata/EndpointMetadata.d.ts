import { RequestAdapterConstructor } from '../adapter/RequestAdapter';
import { Interceptor, InterceptorFunction, InterceptorTypeIdentifier } from '../core/Interceptor';
import { HttpHeaders } from '../http/HttpHeaders';
import { RequestMethodMetadata } from './RequestMethodMetadata';
interface BaseEndpointOptions {
    baseURL: string;
    path?: string;
    timeout?: number;
    headers?: Record<string, string | string[]>;
    adapter?: RequestAdapterConstructor;
    interceptors?: Array<InterceptorTypeIdentifier | Interceptor | InterceptorFunction>;
}
export type EndpointOptions = ({
    extends: Function;
} & Partial<BaseEndpointOptions>) | BaseEndpointOptions;
export declare class EndpointMetadata {
    static from(target: Function): EndpointMetadata;
    private baseURL;
    private timeout;
    private headers;
    private readonly methods;
    private adapter?;
    private interceptors?;
    private constructor();
    setOptions(endpointOptions: EndpointOptions): void;
    getMethodMetadata(methodName: string | symbol): RequestMethodMetadata | undefined;
    setMethodMetadata(methodName: string | symbol, methodMetadata: RequestMethodMetadata): void;
    getMethods(): Map<string | symbol, RequestMethodMetadata>;
    getInterceptors(): Array<InterceptorTypeIdentifier | Interceptor>;
    getAdaptor(): RequestAdapterConstructor | undefined;
    getBaseURL(): string;
    getHeaders(): HttpHeaders;
    getTimeout(): number;
}
export {};
