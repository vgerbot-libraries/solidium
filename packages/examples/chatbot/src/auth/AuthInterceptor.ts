import type {
	EndpointInstance,
	ExecuteRequestMethodParams,
	HttpResponse,
	Interceptor,
	InterceptorNextFunction,
	RequestMethod,
} from "@vgerbot/http";
import { ApplicationContext, Inject } from "@vgerbot/ioc";
import { AuthActionService } from "./AuthActionService";
import { AuthStateService } from "./AuthStateService";

export class AuthInterceptor implements Interceptor {
	@Inject()
	appCtx!: ApplicationContext;
	@Inject()
	service!: AuthStateService;
	async invoke(
		instance: EndpointInstance,
		method: RequestMethod,
		params: ExecuteRequestMethodParams,
		next: InterceptorNextFunction,
	): Promise<HttpResponse> {
		if (this.service.hasToken && this.service.isExpired) {
			const service = this.appCtx.getInstance(AuthActionService);
			await service.refresh();
			return next(instance, method, params);
		} else if (!this.service.hasToken) {
			await this.service.waitUntilAuthenticated();
		}
		params.headers.set("Authorization", `Bearer ${this.service.token}`);
		return next(instance, method, params);
	}
}
