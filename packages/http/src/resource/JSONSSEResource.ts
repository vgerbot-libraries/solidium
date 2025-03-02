import { HttpResponse } from '../core/HttpResponse';
import { ParseError } from '../errors/HttpError';
import { Resource, SET_DATA, SET_ERROR } from './Resource';
import { ResourceError } from './ResourceError';
import { ResourceStatus } from './ResourceStatus';

export abstract class JSONSSEResource<T> extends Resource<T> {
    abstract get messages(): T[];
    abstract get data(): T;
    abstract get error(): ResourceError | null;

    protected abstract [SET_DATA](data: T): void;
    protected abstract [SET_ERROR](error: ResourceError): void;

    protected abstract get status(): ResourceStatus;
    protected abstract set status(status: ResourceStatus);

    protected async handleResponse(response: HttpResponse): Promise<void> {
        const httpStatus = await response.status();

        if (httpStatus >= 200 && httpStatus < 400) {
            try {
                for await (const data of response.jsonStream()) {
                    this[SET_DATA](data as T);
                }
            } catch (error) {
                if (error instanceof SyntaxError) {
                    // Handle JSON parsing error
                    const parseError = new ParseError(
                        'Failed to parse SSE JSON stream',
                        error
                    );
                    this.status = ResourceStatus.ERROR;
                    this[SET_ERROR](new ResourceError(parseError));
                    throw parseError;
                } else {
                    // Re-wrap other errors in ResourceError
                    this.status = ResourceStatus.ERROR;
                    this[SET_ERROR](new ResourceError(error));
                    throw error;
                }
            }
        } else {
            // Create generic HTTP status error
            const httpError = new Error(`HTTP Error ${httpStatus}`);
            this.status = ResourceStatus.ERROR;
            this[SET_ERROR](new ResourceError(httpError));
            throw httpError;
        }
    }
}
