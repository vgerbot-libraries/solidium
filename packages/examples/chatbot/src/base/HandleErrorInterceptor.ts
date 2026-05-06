import { Inject } from "@vgerbot/ioc";
import {
	type EndpointInstance,
	type ExecuteRequestMethodParams,
	type HttpResponse,
	HttpStatusError,
	type Interceptor,
	type InterceptorNextFunction,
	type RequestMethod,
	ResourceError,
} from "@vgerbot/solidium-http";
import { NotifyService } from "./NotifyService";

export class HandleErrorInterceptor implements Interceptor {
	@Inject()
	notifyService!: NotifyService;
	async invoke(
		instance: EndpointInstance,
		method: RequestMethod,
		params: ExecuteRequestMethodParams,
		next: InterceptorNextFunction,
	): Promise<HttpResponse> {
		try {
			return await next(instance, method, params);
		} catch (e) {
			const originError = e instanceof ResourceError ? e.originalError : e;
			if (originError instanceof HttpStatusError) {
				if (originError.responseBody && "message" in originError.responseBody) {
					const message = originError.responseBody.message;
					this.notifyService.alert({
						title: "Error",
						message,
					});
				} else {
					this.notifyService.alert({
						title: "Error",
						message: "Unknown Error!",
					});
				}
			} else {
				this.notifyService.alert({
					title: "Error",
					message: "System Error!",
				});
			}
			throw e;
		}
	}
}
