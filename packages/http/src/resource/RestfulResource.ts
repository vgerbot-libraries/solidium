import { HttpResponse } from '../core/HttpResponse';
import { ParseError } from '../errors/HttpError';
import { Resource, SET_DATA, SET_ERROR } from './Resource';
import { ResourceError } from './ResourceError';
import { ResourceStatus } from './ResourceStatus';

const _SET_ERROR = Symbol('_set_error');

export abstract class RestfulResource<T, E = unknown> extends Resource<T, E> {
    abstract get data(): T;
    abstract get error(): ResourceError<E> | null;

    protected abstract [SET_DATA](data: T): void;
    protected abstract [SET_ERROR](error: ResourceError<E>): void;

    protected abstract get status(): ResourceStatus;
    protected abstract set status(status: ResourceStatus);

    protected async handleResponse(response: HttpResponse) {
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
    }
    private [_SET_ERROR](error: ResourceError<E>) {
        this[SET_ERROR](error);
        this.defer.reject(error);
    }
}
