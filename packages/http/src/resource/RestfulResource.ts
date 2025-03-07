import { HttpResponse } from '../core/HttpResponse';
import { ParseError } from '../errors/HttpError';
import { Resource } from './Resource';
import { ResourceError } from './ResourceError';
import { ResourceStatus } from './ResourceStatus';

const _SET_ERROR = Symbol('_set_error');

export abstract class RestfulResource<T, E = unknown> extends Resource<T, E> {
    protected async handleResponse(response: HttpResponse) {
        try {
            const data = (await response.json()) as T;
            this.state.data = data;
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
        this.state.error = error;
        this.defer.reject(error);
    }
}
