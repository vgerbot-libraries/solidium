import {
    Interceptor,
    InterceptorConstructor,
    InterceptorNextFunction
} from '../core/Interceptor';
import { RequestMethod } from '../core/RequestMethod';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { HttpResponse } from '../core/HttpResponse';
import { HttpError } from '../errors/HttpError';

export interface CircuitBreakerConfig {
    threshold: number;
    resetTimeout: number;
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
    threshold: 5,
    resetTimeout: 60000 // 1 minute
};

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

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
            const response = await next(method, params);

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
