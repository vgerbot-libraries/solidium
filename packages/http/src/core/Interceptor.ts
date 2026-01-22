import type { EndpointInstance } from "./EndpointInstance";
import type { ExecuteRequestMethodParams } from "./ExecuteRequestParams";
import type { HttpResponse } from "./HttpResponse";
import type { RequestMethod } from "./RequestMethod";

/**
 * Interface for HTTP request/response interceptors.
 *
 * Interceptors provide a way to inspect and modify HTTP requests and responses
 * in a middleware-like pattern. They form a chain where each interceptor can:
 * - Modify request parameters before sending
 * - Handle the response or error
 * - Short-circuit the chain by not calling `next`
 * - Wrap the request with additional logic (retries, timeouts, caching, etc.)
 *
 * Common use cases:
 * - Request/response logging
 * - Authentication token injection
 * - Error handling and retry logic
 * - Request/response caching
 * - Timeout enforcement
 * - Circuit breaker pattern
 *
 * @example
 * Logging interceptor:
 * ```typescript
 * class LoggingInterceptor implements Interceptor {
 *   async invoke(instance, method, params, next) {
 *     console.log('Request:', method.name, params);
 *     const start = Date.now();
 *
 *     try {
 *       const response = await next(instance, method, params);
 *       console.log('Response:', Date.now() - start, 'ms');
 *       return response;
 *     } catch (error) {
 *       console.error('Error:', error);
 *       throw error;
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * Auth token interceptor:
 * ```typescript
 * class AuthInterceptor implements Interceptor {
 *   constructor(private getToken: () => string) {}
 *
 *   async invoke(instance, method, params, next) {
 *     const token = this.getToken();
 *     params.headers.set('Authorization', `Bearer ${token}`);
 *     return next(instance, method, params);
 *   }
 * }
 * ```
 */
export interface Interceptor {
	/**
	 * Invokes the interceptor in the request/response chain.
	 *
	 * @param instance - The endpoint instance making the request
	 * @param method - The request method being invoked
	 * @param params - The request parameters (can be modified)
	 * @param next - Function to call the next interceptor or the actual request
	 * @returns Promise resolving to the HTTP response
	 */
	invoke(
		instance: EndpointInstance,
		method: RequestMethod,
		params: ExecuteRequestMethodParams,
		next: InterceptorNextFunction,
	): Promise<HttpResponse>;
}
export type InterceptorConstructor = new () => Interceptor;

export type InterceptorNextFunction = (
	instance: EndpointInstance,
	method: RequestMethod,
	params: ExecuteRequestMethodParams,
) => Promise<HttpResponse>;

export function isInterceptorConstructor(
	value: unknown,
): value is InterceptorConstructor {
	return (
		typeof value === "function" && typeof value.prototype.invoke === "function"
	);
}
export function isInterceptor(value: unknown): value is Interceptor {
	return (
		typeof value === "object" &&
		!!value &&
		"invoke" in value &&
		typeof value.invoke === "function"
	);
}
export type InterceptorTypeIdentifier =
	| InterceptorConstructor
	| string
	| symbol;
