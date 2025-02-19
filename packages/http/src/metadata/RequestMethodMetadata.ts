import { EndpointInstance } from '../core/EndpointInstance';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { HttpResponse } from '../core/HttpResponse';
import { Interceptor, isInterceptorFunction } from '../core/Interceptor';
import { RequestMethod } from '../core/RequestMethod';
import { RequestOptions } from '../decorators/Request';
import { HttpHeaders } from '../http/HttpHeaders';

export type ExecutionHandler = (
    instance: EndpointInstance,
    metadata: RequestMethodMetadata,
    params: ExecuteRequestMethodParams,
    args: unknown[]
) => void;

export class RequestMethodMetadata {
    private readonly executionHandlers: ExecutionHandler[] = [];
    private signal: AbortSignal;
    constructor(
        public readonly name: string | symbol,
        private readonly options: RequestOptions
    ) {
        this.signal = new AbortSignal();
    }

    appendExecutionHandler(handler: ExecutionHandler) {
        this.executionHandlers.push(handler);
    }
    getExecutionHandlers() {
        return this.executionHandlers.slice(0);
    }
    appendSignal(signal: AbortSignal) {
        this.signal = signal;
    }
    getSignal() {
        return this.signal;
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
        return (this.options.interceptors ?? []).map(interceptor => {
            if (isInterceptorFunction(interceptor)) {
                return class implements Interceptor {
                    invoke(
                        method: RequestMethod,
                        params: ExecuteRequestMethodParams,
                        next: {
                            (
                                method: RequestMethod,
                                params: ExecuteRequestMethodParams
                            ): Promise<HttpResponse>;
                            (
                                method: RequestMethod,
                                params: ExecuteRequestMethodParams
                            ): Promise<HttpResponse>;
                        }
                    ) {
                        return interceptor(method, params, next);
                    }
                };
            }
            return interceptor;
        });
    }
    getAdapter() {
        return this.options.adapter;
    }
}
