import type { EndpointInstance } from "../core/EndpointInstance";
import type { ExecuteRequestMethodParams } from "../core/ExecuteRequestParams";
import type { HttpResponse } from "../core/HttpResponse";
import type { Interceptor, InterceptorNextFunction } from "../core/Interceptor";
import type { RequestMethod } from "../core/RequestMethod";
import { HttpError, HttpStatusError } from "../errors/HttpError";

/**
 * Configuration options for the {@link RetryInterceptor}.
 */
export interface RetryConfig {
	/** Maximum number of retry attempts before giving up */
	maxAttempts: number;
	/** Multiplier for exponential backoff (e.g., 2 doubles the delay each retry) */
	backoffFactor: number;
	/** Initial delay in milliseconds before the first retry */
	initialDelay: number;
	/** Maximum delay in milliseconds between retries (caps exponential growth) */
	maxDelay: number;
	/** HTTP status codes that should trigger a retry (e.g., [408, 500, 502, 503, 504]) */
	retryableStatuses: number[];
	/** Custom function to determine if an error should trigger a retry */
	retryable: (error: unknown) => Promise<boolean>;
}

const DEFAULT_CONFIG: RetryConfig = {
	maxAttempts: 3,
	backoffFactor: 2,
	initialDelay: 1000,
	maxDelay: 10000,
	retryableStatuses: [408, 500, 502, 503, 504],
	async retryable(error) {
		if (error instanceof HttpStatusError) {
			return this.retryableStatuses.includes(error.status);
		}
		return true;
	},
};

/**
 * Interceptor that automatically retries failed HTTP requests with exponential backoff.
 *
 * This interceptor implements intelligent retry logic for transient failures such as
 * network timeouts, temporary server errors (5xx), or connection issues. It uses
 * exponential backoff to gradually increase the delay between retries, reducing
 * server load while maximizing the chance of eventual success.
 *
 * Default behavior:
 * - Retries up to 3 times
 * - Uses exponential backoff starting at 1 second, doubling each retry
 * - Caps maximum delay at 10 seconds
 * - Retries on HTTP status codes: 408 (Timeout), 500, 502, 503, 504 (Server Errors)
 *
 * @example
 * Using default retry configuration:
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   interceptors: [RetryInterceptor]
 * })
 * class API {
 *   @Get('/unstable-endpoint')
 *   getData() {
 *     return restful<Data>();
 *   }
 * }
 * // Automatically retries up to 3 times on failure
 * ```
 *
 * @example
 * Custom retry configuration:
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   interceptors: [
 *     new RetryInterceptor({
 *       maxAttempts: 5,
 *       initialDelay: 500,
 *       maxDelay: 30000,
 *       retryableStatuses: [408, 429, 500, 502, 503, 504],
 *       async retryable(error) {
 *         // Custom retry logic
 *         if (error instanceof NetworkError) return true;
 *         if (error instanceof TimeoutError) return true;
 *         return false;
 *       }
 *     })
 *   ]
 * })
 * class API { }
 * ```
 *
 * @example
 * Method-specific retry:
 * ```typescript
 * @Get('/data')
 * @Request({
 *   retry: {
 *     maxAttempts: 5,
 *     initialDelay: 2000
 *   }
 * })
 * getData() {
 *   return restful<Data>();
 * }
 * ```
 */
export class RetryInterceptor implements Interceptor {
	private readonly config: RetryConfig;

	constructor(config: Partial<RetryConfig> = {}) {
		this.config = { ...DEFAULT_CONFIG, ...config };
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async invoke(
		instance: EndpointInstance,
		method: RequestMethod,
		params: ExecuteRequestMethodParams,
		next: InterceptorNextFunction,
	): Promise<HttpResponse> {
		let attempt = 0;
		let delay = this.config.initialDelay;

		while (attempt < this.config.maxAttempts) {
			try {
				return await next(instance, method, params);
			} catch (error) {
				const retryable = await this.config.retryable(error);
				if (!retryable) {
					throw error;
				}
				attempt++;
				if (attempt === this.config.maxAttempts) {
					throwMaxRetryAttempsReachedError(error);
				}

				await this.delay(delay);
				delay = Math.min(
					delay * this.config.backoffFactor,
					this.config.maxDelay,
				);
			}
		}

		// This should never be reached due to the throw above
		throw new Error("Unexpected retry loop exit");

		function throwMaxRetryAttempsReachedError(error: unknown) {
			throw new MaxRetryAttemptsReachedError(attempt, error);
		}
	}
}
export class MaxRetryAttemptsReachedError extends HttpError {
	constructor(
		public readonly attempts: number,
		public readonly originalError: unknown,
	) {
		super("Max retry attempts reached");
	}
}
