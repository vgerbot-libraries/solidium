/**
 * Base class for all HTTP-related errors in the library.
 *
 * This abstract class serves as the foundation for all HTTP error types, including:
 * - Network errors (timeouts, connection failures, aborts)
 * - HTTP status errors (4xx, 5xx)
 * - Parse errors (invalid JSON, etc.)
 * - Custom application errors
 *
 * All HTTP errors extend this base class, making it easy to catch and handle
 * any HTTP-related error with a single catch block.
 *
 * The library provides specific error classes for:
 * - **General Errors**: {@link TimeoutError}, {@link NetworkError}, {@link AbortError}, {@link ParseError}
 * - **Status Errors**: {@link HttpStatusError} and its subclasses
 * - **Client Errors (4xx)**: {@link BadRequestError}, {@link UnauthorizedError}, {@link NotFoundError}, etc.
 * - **Server Errors (5xx)**: {@link InternalServerError}, {@link ServiceUnavailableError}, etc.
 *
 * @example
 * Catching all HTTP errors:
 * ```typescript
 * try {
 *   const resource = api.getData();
 *   await resource.wait();
 * } catch (error) {
 *   if (error instanceof HttpError) {
 *     console.error('HTTP error occurred:', error.message);
 *     if (error.cause) {
 *       console.error('Caused by:', error.cause);
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * Handling specific error types:
 * ```typescript
 * try {
 *   await api.getData().wait();
 * } catch (error) {
 *   if (error instanceof TimeoutError) {
 *     console.error('Request timed out');
 *   } else if (error instanceof UnauthorizedError) {
 *     // Redirect to login
 *   } else if (error instanceof NotFoundError) {
 *     // Show 404 page
 *   } else if (error instanceof HttpStatusError) {
 *     // Handle other HTTP status errors
 *     console.error(`HTTP ${error.status}: ${error.message}`);
 *   }
 * }
 * ```
 *
 * @example
 * Custom error handling in interceptor:
 * ```typescript
 * class ErrorHandlerInterceptor implements Interceptor {
 *   async invoke(instance, method, params, next) {
 *     try {
 *       return await next(instance, method, params);
 *     } catch (error) {
 *       if (error instanceof HttpError) {
 *         // Log to error tracking service
 *         errorTracker.captureException(error);
 *       }
 *       throw error;
 *     }
 *   }
 * }
 * ```
 */
export abstract class HttpError extends Error {
	/**
	 * Creates a new HTTP error.
	 *
	 * @param message - Human-readable error message
	 * @param cause - Optional underlying error that caused this error
	 */
	constructor(
		message: string,
		public readonly cause?: Error,
	) {
		super(message);
		this.name = this.constructor.name;
	}
}
