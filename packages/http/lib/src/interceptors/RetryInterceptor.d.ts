import { Interceptor, InterceptorNextFunction } from '../core/Interceptor';
import { RequestMethod } from '../core/RequestMethod';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { HttpResponse } from '../core/HttpResponse';
export interface RetryConfig {
    maxAttempts: number;
    backoffFactor: number;
    initialDelay: number;
    maxDelay: number;
    retryableStatuses: number[];
    retryable: (error: unknown) => Promise<boolean>;
}
export declare class RetryInterceptor implements Interceptor {
    private readonly config;
    constructor(config?: Partial<RetryConfig>);
    private delay;
    invoke(method: RequestMethod, params: ExecuteRequestMethodParams, next: InterceptorNextFunction): Promise<HttpResponse>;
}
