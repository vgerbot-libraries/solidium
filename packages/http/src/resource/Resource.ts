import { Defer } from '../common/Defer';
import { mergeAbortSignal } from '../common/mergeAbortSignal';
import { isJSON, isText, isTextEventStream } from '../common/mime-utils';
import { METHODS } from '../core/EndpointMembers';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { ExecutionContext } from '../core/execution-context';
import { HttpResponse } from '../core/HttpResponse';
import { RequestMethod } from '../core/RequestMethod';
import {
    AbortError,
    ForbiddenError,
    HttpStatusError,
    NotFoundError,
    ParseError,
    ServerError,
    UnauthorizedError
} from '../errors/HttpError';
import { ResourceError } from './ResourceError';
import { ResourceStatus } from './ResourceStatus';

export const EXECUTE = Symbol('execute');
export const SET_DATA = Symbol('setData');
export const SET_ERROR = Symbol('setError');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyResource = Resource<any, unknown>;

export abstract class Resource<T, B = unknown> {
    abstract get data(): T;
    abstract get error(): ResourceError<B> | null;
    abstract get messages(): T[];

    protected abstract [SET_DATA](data: T): void;
    protected abstract [SET_ERROR](error: ResourceError<B>): void;

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
        const allInterceptors = method.getAlInterceptors(instance);
        const sendRequest = allInterceptors
            .concat({
                invoke: async (method, params, next) => {
                    try {
                        return await next(method, params);
                    } catch (error) {
                        this.status = ResourceStatus.ERROR;
                        if (error instanceof ResourceError) {
                            this[SET_ERROR](error);
                            throw error;
                        } else {
                            const resError = new ResourceError<B>(error);
                            this[SET_ERROR](resError);
                            throw resError;
                        }
                    }
                }
            })
            .reduceRight(
                (next, interceptor) =>
                    (
                        method: RequestMethod,
                        params: ExecuteRequestMethodParams
                    ) => {
                        return interceptor.invoke(method, params, next);
                    },
                async (
                    method: RequestMethod,
                    params: ExecuteRequestMethodParams
                ): Promise<HttpResponse> => {
                    const response = await method.invoke(instance, {
                        ...params,
                        signal
                    });
                    await this.handleResponse(response);
                    return response;
                }
            );
        await sendRequest(method, params);
    }
    protected async *resolveResponseBody(response: HttpResponse) {
        const headers = await response.headers();
        const contentType = headers.get('content-type')?.join(', ');
        if (isJSON(contentType)) {
            try {
                yield await response.json();
            } catch (error) {
                // Handle JSON parsing error
                if (error instanceof SyntaxError) {
                    const parseError = new ParseError(
                        'Failed to parse JSON response',
                        error
                    );
                    throw parseError;
                }
                throw error;
            }
        } else if (isText(contentType)) {
            yield response.text();
        } else if (isTextEventStream(contentType)) {
            yield* response.textStream();
        } else {
            const byteStream = await response.body();
            yield byteStream.readAsBlob();
        }
    }
    protected async handleResponse(response: HttpResponse): Promise<void> {
        try {
            const httpStatus = await response.status();
            if (httpStatus < 200 || httpStatus >= 400) {
                await this.handleHttpErrorResponse(response);
            } else {
                for await (const data of this.resolveResponseBody(response)) {
                    this[SET_DATA](data as T);
                }
                this.status = ResourceStatus.SUCCESS;
            }
        } catch (error) {
            this.status = ResourceStatus.ERROR;
            this[SET_ERROR](new ResourceError(error));
            throw error;
        }
    }
    protected async handleHttpErrorResponse(
        response: HttpResponse
    ): Promise<void> {
        const httpStatus = await response.status();
        const headers = await response.headers();
        const contentType = headers.get('content-type')?.join(', ');
        const datas = [];
        for await (const data of this.resolveResponseBody(response)) {
            datas.push(data);
        }
        const responseBody = isTextEventStream(contentType) ? datas : datas[0];
        // Create generic HTTP status error
        let httpError: HttpStatusError;
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
        this[SET_ERROR](new ResourceError(httpError));
        throw httpError;
    }

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
