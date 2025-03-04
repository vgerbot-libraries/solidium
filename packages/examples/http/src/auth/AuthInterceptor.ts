import {
    ExecuteRequestMethodParams,
    HttpResponse,
    Interceptor,
    InterceptorNextFunction,
    RequestMethod
} from '@vgerbot/http';
import { ApplicationContext, Inject } from '@vgerbot/ioc';
import { AuthStateService } from './AuthStateService';
import { AuthActionService } from './AuthActionService';

export class AuthInterceptor implements Interceptor {
    @Inject()
    appCtx!: ApplicationContext;
    @Inject()
    service!: AuthStateService;
    async invoke(
        method: RequestMethod,
        params: ExecuteRequestMethodParams,
        next: InterceptorNextFunction
    ): Promise<HttpResponse> {
        if (this.service.hasToken && this.service.isExpired) {
            const service = this.appCtx.getInstance(AuthActionService);
            await service.refresh();
            return next(method, params);
        } else if (!this.service.hasToken) {
            await this.service.waitUntilAuthenticated();
        }
        params.headers.set('Authorization', `Bearer ${this.service.token}`);
        return next(method, params);
    }
}
