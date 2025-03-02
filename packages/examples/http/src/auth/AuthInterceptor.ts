import {
    ExecuteRequestMethodParams,
    HttpResponse,
    Interceptor,
    InterceptorNextFunction,
    RequestMethod
} from '@vgerbot/http';
import { Inject } from '@vgerbot/ioc';
import { AuthStateService } from './AuthStateService';

export class AuthInterceptor implements Interceptor {
    @Inject()
    service!: AuthStateService;
    async invoke(
        method: RequestMethod,
        params: ExecuteRequestMethodParams,
        next: InterceptorNextFunction
    ): Promise<HttpResponse> {
        if (method.url.endsWith('/login')) {
            const response = await next(method, params);
            return response;
        } else {
            if (!this.service.token) {
                throw new Error('Not authenticated');
            } else {
                return next(method, params);
            }
        }
    }
}
