import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';

export interface HttpInterceptor {
    intercept(
        request: HttpRequest,
        next: HttpInterceptor
    ): Promise<HttpResponse>;
}
