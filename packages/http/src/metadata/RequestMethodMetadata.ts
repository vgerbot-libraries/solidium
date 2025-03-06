import { EndpointInstance } from '../core/EndpointInstance';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { RequestOptions } from '../decorators/Request';
import { HttpHeaders } from '../http/HttpHeaders';
import { SWRConfig } from '../swr/SWRConfig';

export type ExecutionHandler = (
    instance: EndpointInstance,
    metadata: RequestMethodMetadata,
    params: ExecuteRequestMethodParams,
    args: unknown[]
) => void;

export class RequestMethodMetadata {
    private readonly executionHandlers: ExecutionHandler[] = [];
    private swrConfig?: SWRConfig;
    private readonly options: RequestOptions = { path: '/', method: 'GET' };
    constructor(public readonly name: string | symbol) {}
    setOptions(options: RequestOptions) {
        Object.assign(this.options, options);
    }
    appendSWRConfig(config: SWRConfig) {
        this.swrConfig = {
            ...this.swrConfig,
            ...config
        };
    }
    getSWRConfig() {
        return this.swrConfig;
    }
    getRetryConfig() {
        return this.options.retry;
    }
    appendExecutionHandler(handler: ExecutionHandler) {
        this.executionHandlers.push(handler);
    }
    getExecutionHandlers() {
        return this.executionHandlers.slice(0);
    }
    getPath() {
        return this.options.path;
    }
    getHttpMethod() {
        return this.options.method;
    }
    getHeaders() {
        const headers = new HttpHeaders();
        headers.setAll(this.options.headers ?? {});
        return headers;
    }
    getTimeout() {
        return this.options.timeout ?? 0;
    }
    getInterceptors() {
        return this.options.interceptors ?? [];
    }
    getExcludeInterceptors() {
        return this.options.excludeInterceptors ?? [];
    }
    getAdapter() {
        return this.options.adapter;
    }
    isReactive() {
        return this.options.reactive ?? false;
    }
}
