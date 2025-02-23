import { Interceptor, InterceptorNextFunction } from '../core/Interceptor';
import { RequestMethod } from '../core/RequestMethod';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { HttpResponse } from '../core/HttpResponse';
export interface TimeoutConfig {
    timeout: number;
}
export declare class TimeoutInterceptor implements Interceptor {
    private readonly config;
    constructor(config?: Partial<TimeoutConfig>);
    invoke(method: RequestMethod, params: ExecuteRequestMethodParams, next: InterceptorNextFunction): Promise<HttpResponse>;
}
