import { Interceptor, InterceptorNextFunction } from '../core/Interceptor';
import { RequestMethod } from '../core/RequestMethod';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { HttpResponse } from '../core/HttpResponse';
import { HttpError, HttpStatusError } from '../errors/HttpError';
import { EndpointInstance } from '../core/EndpointInstance';

export interface RetryConfig {
    maxAttempts: number;
    backoffFactor: number;
    initialDelay: number;
    maxDelay: number;
    retryableStatuses: number[];
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
    }
};

export class RetryInterceptor implements Interceptor {
    private readonly config: RetryConfig;

    constructor(config: Partial<RetryConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async invoke(
        instance: EndpointInstance,
        method: RequestMethod,
        params: ExecuteRequestMethodParams,
        next: InterceptorNextFunction
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
                    this.config.maxDelay
                );
            }
        }

        // This should never be reached due to the throw above
        throw new Error('Unexpected retry loop exit');

        function throwMaxRetryAttempsReachedError(error: unknown) {
            throw new MaxRetryAttemptsReachedError(attempt, error);
        }
    }
}
export class MaxRetryAttemptsReachedError extends HttpError {
    constructor(
        public readonly attempts: number,
        public readonly originalError: unknown
    ) {
        super('Max retry attempts reached');
    }
}
