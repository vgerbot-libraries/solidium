import { Interceptor, InterceptorNextFunction } from '../core/Interceptor';
import { RequestMethod } from '../core/RequestMethod';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { HttpResponse } from '../core/HttpResponse';
import { TimeoutError } from '../errors/HttpError';
import { mergeAbortSignal } from '../common/mergeAbortSignal';
import { EndpointInstance } from '../core/EndpointInstance';

export interface TimeoutConfig {
    timeout: number;
}

const DEFAULT_CONFIG: TimeoutConfig = {
    timeout: 30000 // 30 seconds
};

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
