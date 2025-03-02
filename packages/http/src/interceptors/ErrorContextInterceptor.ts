import { Interceptor, InterceptorNextFunction } from '../core/Interceptor';
import { RequestMethod } from '../core/RequestMethod';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { HttpResponse } from '../core/HttpResponse';
import { HttpError } from '../errors/HttpError';

export class ErrorContextInterceptor implements Interceptor {
    async invoke(
        method: RequestMethod,
        params: ExecuteRequestMethodParams,
        next: InterceptorNextFunction
    ): Promise<HttpResponse> {
        try {
            return await next(method, params);
        } catch (error) {
            if (error instanceof HttpError) {
                // Enhance error context with request details
                Object.defineProperty(error, 'context', {
                    value: {
                        methodName: method.name.toString(),
                        timestamp: new Date().toISOString(),
                        headers: params.headers.toJSON(),
                        pathVariables: params.pathVariables,
                        queryParams: params.queryParams
                    }
                });
            }
            throw error;
        }
    }
}
