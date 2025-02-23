import { Interceptor, InterceptorNextFunction } from '../core/Interceptor';
import { RequestMethod } from '../core/RequestMethod';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { HttpResponse } from '../core/HttpResponse';
export declare class ErrorContextInterceptor implements Interceptor {
    invoke(method: RequestMethod, params: ExecuteRequestMethodParams, next: InterceptorNextFunction): Promise<HttpResponse>;
}
