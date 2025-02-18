import { RequestAdapterConstructor } from '../adapter/RequestAdapter';
import {
    buildEndpointClass,
    EndpointInstance
} from '../core/buildEndpointClass';
import {
    InterceptorConstructor,
    InterceptorFunction,
    isInterceptorFunction
} from '../core/Interceptor';
import { HttpHeaders } from '../http/HttpHeaders';
import { RequestMethodMetadata } from './RequestMethodMetadata';
import { RequestMethod } from '../core/RequestMethod';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { HttpResponse } from '../core/HttpResponse';
import { Class } from '../common/Class';

interface BaseEndpointOptions {
    baseURL: string;
    path?: string;
    timeout?: number;
    headers?: Record<string, string | string[]>;
    adapter?: RequestAdapterConstructor;
    interceptors?: Array<
        InterceptorConstructor | InterceptorFunction | string | symbol
    >;
}
export type EndpointOptions =
    | ({
          extends: Function;
      } & Partial<BaseEndpointOptions>)
    | BaseEndpointOptions;
const ENDPOINT_METADATA_KEY = '@http:endpoint';
export class EndpointMetadata {
    static from(target: Function) {
        if (Reflect.hasMetadata(ENDPOINT_METADATA_KEY, target)) {
            return Reflect.getMetadata(
                ENDPOINT_METADATA_KEY,
                target
            ) as EndpointMetadata;
        }
        const metadata = new EndpointMetadata();
        Reflect.defineMetadata(ENDPOINT_METADATA_KEY, metadata, target);

        buildEndpointClass(target as Class<EndpointInstance>, metadata);

        return metadata;
    }
    private baseURL!: string;
    private timeout: number = 0;
    private headers = new HttpHeaders();
    private readonly methods = new Map<
        string | symbol,
        RequestMethodMetadata
    >();
    private adapter?: RequestAdapterConstructor;
    private interceptors?: Array<
        InterceptorConstructor | InterceptorFunction | string | symbol
    >;
    private constructor() {}

    setOptions(endpointOptions: EndpointOptions) {
        if ('extends' in endpointOptions) {
            const parent = EndpointMetadata.from(endpointOptions.extends);
            this.baseURL = parent.baseURL;
            this.timeout = parent.timeout;
            this.headers = this.headers.concat(parent.headers);
            this.interceptors = parent.interceptors;
            this.adapter = parent.adapter;
        }
        if (endpointOptions.baseURL) {
            this.baseURL = endpointOptions.baseURL;
        } else {
            if (typeof document === 'object') {
                this.baseURL = document.baseURI;
            } else {
                throw new Error('baseURL is not set');
            }
        }
        if (endpointOptions.timeout) {
            this.timeout = endpointOptions.timeout;
        }
        if (endpointOptions.headers) {
            const headers = endpointOptions.headers;
            this.headers.setAll(headers);
        }
        if (endpointOptions.interceptors) {
            if (this.interceptors) {
                this.interceptors = this.interceptors.concat(
                    endpointOptions.interceptors
                );
            } else {
                this.interceptors = endpointOptions.interceptors;
            }
        }
        if (endpointOptions.adapter) {
            this.adapter = endpointOptions.adapter;
        }
    }
    // getMethodMetadata(methodName: string | symbol) {
    //     if (this.methods.has(methodName)) {
    //         return this.methods.get(methodName);
    //     }
    //     const methodMetadata = new RequestMethodMetadata();
    //     this.methods.set(methodName, methodMetadata);
    //     return methodMetadata;
    // }
    setMethodMetadata(
        methodName: string | symbol,
        methodMetadata: RequestMethodMetadata
    ) {
        this.methods.set(methodName, methodMetadata);
    }
    getMethods() {
        return this.methods;
    }
    getInterceptors(): Array<InterceptorConstructor | string | symbol> {
        return (
            this.interceptors?.map(interceptor => {
                if (isInterceptorFunction(interceptor)) {
                    return class {
                        invoke(
                            method: RequestMethod,
                            params: ExecuteRequestMethodParams,
                            next: (
                                method: RequestMethod,
                                params: ExecuteRequestMethodParams
                            ) => Promise<HttpResponse>
                        ): Promise<HttpResponse> {
                            return interceptor(method, params, next);
                        }
                    } as InterceptorConstructor;
                }
                return interceptor;
            }) ?? []
        );
    }
    getAdaptor(): RequestAdapterConstructor | undefined {
        return this.adapter;
    }
    getBaseURL() {
        return this.baseURL;
    }
    getHeaders() {
        return this.headers;
    }
    getTimeout() {
        return this.timeout;
    }
}
