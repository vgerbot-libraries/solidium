import { HttpResponse } from '../core/HttpResponse';
import {
    HttpStatusError,
    ParseError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ServerError
} from '../errors/HttpError';
import { Resource, SET_DATA, SET_ERROR } from './Resource';
import { ResourceError } from './ResourceError';
import { ResourceStatus } from './ResourceStatus';

const _SET_ERROR = Symbol('_set_error');

export abstract class RestfulResource<T> extends Resource<T> {
    abstract get data(): T;
    abstract get error(): ResourceError | null;

    protected abstract [SET_DATA](data: T): void;
    protected abstract [SET_ERROR](error: ResourceError): void;

    protected abstract get status(): ResourceStatus;
    protected abstract set status(status: ResourceStatus);

    protected async handleResponse(response: HttpResponse) {
        const httpStatus = await response.status();
        const headers = await response.headers();

        if (httpStatus >= 200 && httpStatus < 400) {
            try {
                const data = (await response.json()) as T;
                this[SET_DATA](data);
                this.defer.resolve(data);
            } catch (error) {
                if (error instanceof SyntaxError) {
                    // Handle JSON parsing error
                    const parseError = new ParseError(
                        'Failed to parse JSON response',
                        error
                    );
                    this.status = ResourceStatus.ERROR;
                    this[_SET_ERROR](new ResourceError(parseError));
                    throw parseError;
                } else {
                    throw error;
                }
            }
        } else {
            // Handle error responses based on status code
            let responseBody: unknown = null;
            let httpError: HttpStatusError;

            try {
                // Try to parse response body as JSON if possible
                responseBody = await response.json();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_) {
                try {
                    // If JSON parsing fails, try to get as text
                    responseBody = await response.text();
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (_) {
                    // If text fails too, leave as null
                }
            }

            // Create appropriate error based on status code
            if (httpStatus === 401) {
                httpError = new UnauthorizedError(headers, responseBody);
            } else if (httpStatus === 403) {
                httpError = new ForbiddenError(headers, responseBody);
            } else if (httpStatus === 404) {
                httpError = new NotFoundError(headers, responseBody);
            } else if (httpStatus >= 500) {
                httpError = new ServerError(
                    httpStatus,
                    response.init.method.toString(),
                    headers,
                    responseBody
                );
            } else {
                // Generic HTTP status error for other codes
                httpError = new HttpStatusError(
                    httpStatus,
                    response.init.method.toString(),
                    headers,
                    responseBody
                );
            }

            this.status = ResourceStatus.ERROR;
            this[_SET_ERROR](new ResourceError(httpError));
            throw httpError;
        }
    }
    private [_SET_ERROR](error: ResourceError) {
        this[SET_ERROR](error);
        this.defer.reject(error);
    }
}
