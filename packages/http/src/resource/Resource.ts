import {
    AbortError,
    HttpError,
    NetworkError,
    ParseError,
    TimeoutError
} from '../errors/HttpError';
import { mergeAbortSignal } from '../common/mergeAbortSignal';
import { METHODS } from '../core/EndpointMembers';
import { ExecutionContext } from '../core/execution-context';
import { HttpResponse } from '../core/HttpResponse';
import { ResourceError } from './ResourceError';
import { ResourceStatus } from './ResourceStatus';
import { Defer } from '../common/Defer';

export const EXECUTE = Symbol('execute');
export const SET_DATA = Symbol('setData');
export const SET_ERROR = Symbol('setError');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyResource = Resource<any>;

export abstract class Resource<T> {
    abstract get data(): T;
    abstract get error(): ResourceError | null;

    protected abstract [SET_DATA](data: T): void;
    protected abstract [SET_ERROR](error: ResourceError): void;

    protected abstract get status(): ResourceStatus;
    protected abstract set status(status: ResourceStatus);
    protected readonly abortController = new AbortController();
    protected readonly defer = new Defer<T>();
    constructor() {
        this.abortController.signal.addEventListener('abort', () => {
            this.status = ResourceStatus.ABORTED;
            this[SET_ERROR](
                new ResourceError(new AbortError(), ResourceStatus.ABORTED)
            );
        });
    }

    get idle() {
        return this.status === ResourceStatus.IDLE;
    }
    get pending() {
        return this.status === ResourceStatus.PENDING;
    }
    get success() {
        return this.status === ResourceStatus.SUCCESS;
    }
    get aborted() {
        return this.status === ResourceStatus.ABORTED;
    }
    get failure() {
        return this.status === ResourceStatus.ERROR;
    }
    abort() {
        this.abortController.abort();
    }
    protected async [EXECUTE](context: ExecutionContext, args: unknown[]) {
        const { instance, method: methodMetadata, params } = context;
        const method = instance[METHODS].get(methodMetadata.name);
        if (!method) {
            const error = new Error(
                `Not found method ${methodMetadata.name.toString()}`
            );
            this.status = ResourceStatus.ERROR;
            this[SET_ERROR](new ResourceError(error));
            throw error;
        }
        const executionHandlers = methodMetadata.getExecutionHandlers();
        executionHandlers.forEach(handler => {
            handler(instance, methodMetadata, params, args);
        });
        this.status = ResourceStatus.PENDING;
        let signal = params.signal;
        if (signal) {
            signal = mergeAbortSignal(
                params.signal,
                this.abortController.signal
            );
        }
        try {
            const response = await method.invoke(instance, {
                ...params,
                signal
            });
            this.status = ResourceStatus.SUCCESS;
            await this.handleResponse(response);
        } catch (error) {
            // Handle different error types
            if (error instanceof DOMException && error.name === 'AbortError') {
                // Convert DOMException AbortError to our AbortError
                const abortError = new AbortError('Request was aborted', error);
                this.status = ResourceStatus.ABORTED;
                this[SET_ERROR](
                    new ResourceError(abortError, ResourceStatus.ABORTED)
                );
                throw abortError;
            } else if (
                error instanceof TypeError &&
                error.message.includes('NetworkError')
            ) {
                // Handle network errors
                const networkError = new NetworkError(
                    'Network error occurred',
                    error
                );
                this.status = ResourceStatus.ERROR;
                this[SET_ERROR](new ResourceError(networkError));
                throw networkError;
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
                this.status = ResourceStatus.ERROR;
                this[SET_ERROR](new ResourceError(timeoutError));
                throw timeoutError;
            } else if (
                error instanceof SyntaxError &&
                error.message.includes('JSON')
            ) {
                // Handle JSON parsing errors
                const parseError = new ParseError(
                    'Failed to parse JSON response',
                    error
                );
                this.status = ResourceStatus.ERROR;
                this[SET_ERROR](new ResourceError(parseError));
                throw parseError;
            } else if (error instanceof HttpError) {
                // Already a HttpError, just wrap it in ResourceError
                this.status = ResourceStatus.ERROR;
                this[SET_ERROR](new ResourceError(error));
                throw error;
            } else {
                // Unknown error type
                this.status = ResourceStatus.ERROR;
                this[SET_ERROR](new ResourceError(error));
                throw error;
            }
        }
    }
    protected abstract handleResponse(response: HttpResponse): Promise<void>;

    then(
        onFulfilled?: ((value: T) => T | PromiseLike<T>) | undefined,
        onRejected?: ((reason: unknown) => T | PromiseLike<T>) | undefined
    ): Promise<T> {
        return this.defer.promise.then(onFulfilled, onRejected);
    }
    catch(
        onRejected?: ((reason: unknown) => T | PromiseLike<T>) | undefined
    ): Promise<T> {
        return this.defer.promise.catch(onRejected);
    }
    finally(onFinally?: (() => void) | undefined): Promise<T> {
        return this.defer.promise.finally(onFinally);
    }
}
