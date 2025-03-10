import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { HttpResponse } from '../core/HttpResponse';
import { Interceptor, InterceptorNextFunction } from '../core/Interceptor';
import { RequestMethod } from '../core/RequestMethod';
import {
    AbortError,
    NetworkError,
    ParseError,
    TimeoutError
} from '../errors/HttpError';
import { ResourceError } from '../resource/ResourceError';

export class ErrorWrappingInterceptor implements Interceptor {
    async invoke(
        method: RequestMethod,
        params: ExecuteRequestMethodParams,
        next: InterceptorNextFunction
    ): Promise<HttpResponse> {
        try {
            const response = await next(method, params);
            return response;
        } catch (error) {
            // Handle different error types
            if (error instanceof DOMException && error.name === 'AbortError') {
                // Convert DOMException AbortError to our AbortError
                const abortError = new AbortError('Request was aborted', error);
                throw new ResourceError(abortError);
            } else if (
                error instanceof TypeError &&
                error.message.includes('NetworkError')
            ) {
                // Handle network errors
                const networkError = new NetworkError(
                    'Network error occurred',
                    error
                );
                throw new ResourceError(networkError);
            } else if (
                error instanceof TypeError &&
                error.message.includes('timeout')
            ) {
                // Handle timeout errors
                const timeoutError = new TimeoutError(
                    'Request timed out',
                    {},
                    error
                );
                throw new ResourceError(timeoutError);
            } else if (
                error instanceof SyntaxError &&
                error.message.includes('JSON')
            ) {
                // Handle JSON parsing errors
                const parseError = new ParseError(
                    'Failed to parse JSON response',
                    error
                );
                throw new ResourceError(parseError);
            } else {
                throw new ResourceError(error);
            }
        }
    }
}
