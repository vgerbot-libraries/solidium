import { Interceptor, InterceptorNextFunction } from '../core/Interceptor';
import { RequestMethod } from '../core/RequestMethod';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { HttpResponse } from '../core/HttpResponse';
import { TimeoutError } from '../errors/HttpError';
import { mergeAbortSignal } from '../common/mergeAbortSignal';
import { EndpointInstance } from '../core/EndpointInstance';

/**
 * Configuration options for the {@link TimeoutInterceptor}.
 */
export interface TimeoutConfig {
    /** Timeout duration in milliseconds */
    timeout: number;
}

const DEFAULT_CONFIG: TimeoutConfig = {
    timeout: 30000 // 30 seconds
};

/**
 * Interceptor that enforces a timeout on HTTP requests.
 *
 * This interceptor automatically aborts requests that take longer than the specified
 * timeout duration, preventing requests from hanging indefinitely. It's essential for
 * maintaining application responsiveness and resource management.
 *
 * The timeout is implemented using AbortController, which properly cancels the underlying
 * network request rather than just ignoring the response.
 *
 * Default behavior:
 * - Timeout after 30 seconds
 * - Throws {@link TimeoutError} when timeout is reached
 * - Properly aborts the underlying request
 *
 * @example
 * Global timeout for all endpoints:
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   timeout: 10000  // 10 seconds
 * })
 * class API {
 *   @Get('/data')
 *   getData() {
 *     return restful<Data>();
 *   }
 * }
 * ```
 *
 * @example
 * Method-specific timeout:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class API {
 *   @Get('/fast-endpoint')
 *   @Request({ timeout: 5000 })  // 5 seconds
 *   getFastData() {
 *     return restful<Data>();
 *   }
 *
 *   @Get('/slow-endpoint')
 *   @Request({ timeout: 60000 })  // 60 seconds
 *   getSlowData() {
 *     return restful<Data>();
 *   }
 * }
 * ```
 *
 * @example
 * Handling timeout errors:
 * ```typescript
 * const resource = api.getData();
 *
 * try {
 *   await resource.wait();
 * } catch (error) {
 *   if (error instanceof TimeoutError) {
 *     console.error('Request timed out after', error.context.timeout, 'ms');
 *     // Show timeout message to user
 *   }
 * }
 * ```
 *
 * @example
 * Disable timeout for specific request:
 * ```typescript
 * @Get('/long-running-task')
 * @Request({ timeout: 0 })  // No timeout
 * startLongTask() {
 *   return restful<Task>();
 * }
 * ```
 */
export class TimeoutInterceptor implements Interceptor {
    private readonly config: TimeoutConfig;

    constructor(config: Partial<TimeoutConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    async invoke(
        instance: EndpointInstance,
        method: RequestMethod,
        params: ExecuteRequestMethodParams,
        next: InterceptorNextFunction
    ): Promise<HttpResponse> {
        const controller = new AbortController();
        const timeoutId = setTimeout(
            () => controller.abort(),
            this.config.timeout
        );

        try {
            // Merge the timeout signal with any existing signal
            const signal = mergeAbortSignal(params.signal, controller.signal);

            return await Promise.race([
                next(instance, method, { ...params, signal }),
                new Promise<never>((_, reject) =>
                    setTimeout(
                        () =>
                            reject(
                                new TimeoutError(
                                    `Request timeout after ${this.config.timeout}ms`,
                                    {
                                        timeout: this.config.timeout,
                                        method: method.name.toString()
                                    }
                                )
                            ),
                        this.config.timeout
                    )
                )
            ]);
        } finally {
            clearTimeout(timeoutId);
        }
    }
}
