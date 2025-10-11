import {
    Interceptor,
    InterceptorConstructor,
    InterceptorNextFunction
} from '../core/Interceptor';
import { RequestMethod } from '../core/RequestMethod';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { HttpResponse } from '../core/HttpResponse';
import { HttpError } from '../errors/HttpError';
import { EndpointInstance } from '../core/EndpointInstance';

/**
 * Configuration options for the {@link CircuitBreakerInterceptor}.
 */
export interface CircuitBreakerConfig {
    /** Number of consecutive failures before opening the circuit */
    threshold: number;
    /** Time in milliseconds before attempting to close the circuit (transition to HALF_OPEN) */
    resetTimeout: number;
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
    threshold: 5,
    resetTimeout: 60000 // 1 minute
};

/**
 * Circuit breaker state.
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Circuit is open, requests fail immediately
 * - HALF_OPEN: Testing if service recovered, allows one request through
 */
type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

/**
 * Interceptor implementing the Circuit Breaker pattern to prevent cascading failures.
 *
 * The Circuit Breaker pattern protects your application from repeatedly trying to execute
 * an operation that's likely to fail. When failures reach a threshold, the circuit "opens"
 * and subsequent requests fail immediately without attempting the actual call. After a
 * timeout period, the circuit enters a "half-open" state to test if the service has recovered.
 *
 * Circuit States:
 * - **CLOSED**: Normal operation. Requests pass through. Failures are counted.
 * - **OPEN**: Too many failures occurred. Requests fail immediately with {@link CircuitBreakerError}.
 * - **HALF_OPEN**: Testing recovery. One request is allowed through. Success closes the circuit,
 *   failure reopens it.
 *
 * Default behavior:
 * - Opens circuit after 5 consecutive failures
 * - Attempts to reset after 60 seconds
 *
 * This pattern is essential for:
 * - Preventing resource exhaustion from repeated failed requests
 * - Allowing failing services time to recover
 * - Failing fast instead of blocking threads/resources
 * - Improving overall system resilience
 *
 * @example
 * Basic usage with default configuration:
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   interceptors: [CircuitBreakerInterceptor]
 * })
 * class API {
 *   @Get('/flaky-service')
 *   getData() {
 *     return restful<Data>();
 *   }
 * }
 *
 * // After 5 failures, subsequent calls fail immediately for 60 seconds
 * ```
 *
 * @example
 * Custom configuration:
 * ```typescript
 * const customCircuitBreaker = CircuitBreakerInterceptor.of({
 *   threshold: 3,        // Open after 3 failures
 *   resetTimeout: 30000  // Try again after 30 seconds
 * });
 *
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   interceptors: [customCircuitBreaker]
 * })
 * class API { }
 * ```
 *
 * @example
 * Handling circuit breaker errors:
 * ```typescript
 * try {
 *   const resource = api.getData();
 *   await resource.wait();
 * } catch (error) {
 *   if (error instanceof CircuitBreakerError) {
 *     console.log('Service temporarily unavailable');
 *     // Show cached data or fallback UI
 *   }
 * }
 * ```
 */
export class CircuitBreakerInterceptor implements Interceptor {
    protected failures = 0;
    protected lastFailureTime = 0;
    protected state: CircuitState = 'CLOSED';
    protected readonly config: CircuitBreakerConfig;

    static of(config: Partial<CircuitBreakerConfig> = DEFAULT_CONFIG) {
        class SubCircuitBreakerInterceptor extends CircuitBreakerInterceptor {
            constructor() {
                super(config);
            }
        }
        return SubCircuitBreakerInterceptor as InterceptorConstructor;
    }

    constructor(config: Partial<CircuitBreakerConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    private shouldReset(): boolean {
        return (
            this.state === 'OPEN' &&
            Date.now() - this.lastFailureTime >= this.config.resetTimeout
        );
    }

    async invoke(
        instance: EndpointInstance,
        method: RequestMethod,
        params: ExecuteRequestMethodParams,
        next: InterceptorNextFunction
    ): Promise<HttpResponse> {
        if (this.state === 'OPEN') {
            if (this.shouldReset()) {
                this.state = 'HALF_OPEN';
            } else {
                throw new CircuitBreakerError();
            }
        }

        try {
            const response = await next(instance, method, params);

            if (this.state === 'HALF_OPEN') {
                this.state = 'CLOSED';
                this.failures = 0;
            }

            return response;
        } catch (error) {
            this.failures++;
            this.lastFailureTime = Date.now();

            if (this.failures >= this.config.threshold) {
                this.state = 'OPEN';
            }

            throw error;
        }
    }
}
export class CircuitBreakerError extends HttpError {
    constructor(message = 'Circuit breaker is open') {
        super(message);
    }
}
