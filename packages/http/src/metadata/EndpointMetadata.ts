import {
    RequestAdapterConstructor,
    RequestAdapterFactory
} from '../adapter/RequestAdapter';
import {
    InterceptorConstructor,
    InterceptorFunction
} from '../core/Interceptor';
import { HttpHeaders } from '../http/HttpHeaders';
import { RequestMethodMetadata } from './RequestMethodMetadata';

interface BaseEndpointOptions {
    baseURL?: string;
    path?: string;
    timeout?: number;
    headers?: Record<string, string | string[]>;
    adapter?:
        | RequestAdapterConstructor
        | RequestAdapterFactory
        | string
        | symbol;
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
        return metadata;
    }
    private baseURL: string = document.baseURI;
    private timeout: number = 0;
    private headers = new HttpHeaders();
    private readonly methods = new Map<
        string | symbol,
        RequestMethodMetadata
    >();
    private constructor() {}

    setOptions(endpointOptions: EndpointOptions) {
        if ('extends' in endpointOptions) {
            const parent = EndpointMetadata.from(endpointOptions.extends);
            this.baseURL = parent.baseURL;
            this.timeout = parent.timeout;
            this.headers = this.headers.concat(parent.headers);
        }
        if (endpointOptions.baseURL) {
            this.baseURL = endpointOptions.baseURL;
        }
        if (endpointOptions.timeout) {
            this.timeout = endpointOptions.timeout;
        }
        if (endpointOptions.headers) {
            const headers = endpointOptions.headers;
            for (const key in headers) {
                const value = headers[key];
                if (Array.isArray(value)) {
                    this.headers.set(key, ...value);
                } else {
                    this.headers.set(key, value);
                }
            }
        }
    }
    getMethodMetadata(methodName: string | symbol) {
        if (this.methods.has(methodName)) {
            return this.methods.get(methodName);
        }
        const methodMetadata = new RequestMethodMetadata();
        this.methods.set(methodName, methodMetadata);
        return methodMetadata;
    }
}
