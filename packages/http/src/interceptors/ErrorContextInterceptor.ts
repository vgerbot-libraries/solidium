import type { EndpointInstance } from "../core/EndpointInstance";
import type { ExecuteRequestMethodParams } from "../core/ExecuteRequestParams";
import type { HttpResponse } from "../core/HttpResponse";
import type { Interceptor, InterceptorNextFunction } from "../core/Interceptor";
import type { RequestMethod } from "../core/RequestMethod";
import { HttpError } from "../errors/HttpError";

export class ErrorContextInterceptor implements Interceptor {
	async invoke(
		instance: EndpointInstance,
		method: RequestMethod,
		params: ExecuteRequestMethodParams,
		next: InterceptorNextFunction,
	): Promise<HttpResponse> {
		try {
			return await next(instance, method, params);
		} catch (error) {
			if (error instanceof HttpError) {
				// Enhance error context with request details
				Object.defineProperty(error, "context", {
					value: {
						methodName: method.name.toString(),
						timestamp: new Date().toISOString(),
						headers: params.headers.toJSON(),
						pathVariables: params.pathVariables,
						queryParams: params.queryParams,
					},
				});
			}
			throw error;
		}
	}
}
