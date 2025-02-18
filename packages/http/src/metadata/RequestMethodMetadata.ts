import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { HttpResponse } from '../core/HttpResponse';
import { Interceptor, isInterceptorFunction } from '../core/Interceptor';
import { RequestMethod } from '../core/RequestMethod';
import { RequestOptions } from '../decorators/Request';
import { HttpHeaders } from '../http/HttpHeaders';

export type ExecutionHandler = (
    metadata: RequestMethodMetadata,
    params: ExecuteRequestMethodParams,
    args: unknown[]
) => void;

export class RequestMethodMetadata {
    private readonly executionHandlers: ExecutionHandler[] = [];
    constructor(private readonly options: RequestOptions) {}

    appendExecutionHandler(handler: ExecutionHandler) {
        this.executionHandlers.push(handler);
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
