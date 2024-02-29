import { CommonInterceptorNameEnum } from '../core/constants';
import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';

export interface HttpInterceptor {
    name: CommonInterceptorNameEnum | string;
    intercept(
        request: HttpRequest,
        next: (request: HttpRequest) => Promise<HttpResponse>
    ): Promise<HttpResponse>;
}
