import { Interceptor, InterceptorConstructor, InterceptorNextFunction } from '../core/Interceptor';
import { RequestMethod } from '../core/RequestMethod';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { HttpResponse } from '../core/HttpResponse';
export interface CircuitBreakerConfig {
    threshold: number;
    resetTimeout: number;
}
type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';
export declare class CircuitBreakerInterceptor implements Interceptor {
    protected failures: number;
    protected lastFailureTime: number;
    protected state: CircuitState;
    protected readonly config: CircuitBreakerConfig;
    static of(config?: Partial<CircuitBreakerConfig>): InterceptorConstructor;
    constructor(config?: Partial<CircuitBreakerConfig>);
    private shouldReset;
    invoke(method: RequestMethod, params: ExecuteRequestMethodParams, next: InterceptorNextFunction): Promise<HttpResponse>;
}
export {};
