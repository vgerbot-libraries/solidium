import { ExecuteRequestMethodParams } from './ExecuteRequestParams';
import { HttpResponse } from './HttpResponse';
import { RequestMethod } from './RequestMethod';

export interface Interceptor {
    invoke(
        method: RequestMethod,
        params: ExecuteRequestMethodParams,
        next: (method: RequestMethod, params: ExecuteRequestMethodParams) => Promise<HttpResponse>
    ): Promise<HttpResponse>;
}
export interface InterceptorConstructor {
    new (): Interceptor;
}

export type InterceptorFunction = Interceptor['invoke'];
