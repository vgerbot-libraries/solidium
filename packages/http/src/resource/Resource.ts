import { firstValueFrom, Observer, Subject } from 'rxjs';
import { mergeAbortSignal } from '../common/mergeAbortSignal';
import { isJSON, isText, isTextEventStream } from '../common/mime-utils';
import { METHODS } from '../core/EndpointMembers';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { ExecutionContext } from '../core/execution-context';
import { HttpResponse } from '../core/HttpResponse';
import { RequestMethod } from '../core/RequestMethod';
import { ParseError } from '../errors/HttpError';
import { HttpStatusErrorFactory } from '../errors/HttpStatusErrorFactory';
import { RequestStatus } from './RequestStatus';
import { ResourceError } from './ResourceError';
import { ResourceExecutionState } from './ResourceExecutionState';

export const EXECUTE = Symbol('execute');
export const SET_DATA = Symbol('setData');
export const SET_ERROR = Symbol('setError');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyResource = Resource<any, unknown>;

export abstract class Resource<T, B = unknown> {
    private readonly $state = new Subject<ResourceExecutionState<T, B>>();
    protected state?: ResourceExecutionState<T, B>;

    get data(): T | undefined {
        return this.state?.data;
    }
    get error(): ResourceError<B> | undefined | null {
        return this.state?.reason;
    }
    get messages(): T[] {
        return this.state?.messages ?? [];
    }

    get idle() {
        return this.state ? this.state.idle : true;
    }
    get opened() {
        return this.state ? this.state.opened : false;
    }
    get loading() {
        return this.state ? this.state.loading : false;
    }
    get success() {
        return this.state ? this.state.success : false;
    }
    get aborted() {
        return this.state ? this.state.aborted : false;
    }
    get failure() {
        return this.state ? this.state.failure : false;
    }

    protected readonly abortController = new AbortController();

    abort() {
        this.abortController.abort();
    }
    wait() {
        if (this.state) {
            return Promise.resolve(this.state);
        }
        return firstValueFrom(this.$state);
    }
    subscribe(
        observerOrNext?:
            | Partial<Observer<ResourceExecutionState<T, B>>>
            | ((value: ResourceExecutionState<T, B>) => void)
    ) {
        return this.$state.subscribe(observerOrNext);
    }

    protected [EXECUTE](
        context: ExecutionContext,
        args: unknown[],
        factory: () => ResourceExecutionState<T, B>
    ): ResourceExecutionState<T, B> {
        const state = factory();
        state.init();
        this.$state.next(state);

        const lastExecutionAbortController = this.state?.abortController;
        lastExecutionAbortController?.abort();
        this.state = state;
        const { instance, method: methodMetadata, params } = context;
        const method = instance[METHODS].get(methodMetadata.name);
        if (!method) {
            const error = new Error(
                `Not found method ${methodMetadata.name.toString()}`
            );
            state.error(new ResourceError(error));
            throw error;
        }
        const executionHandlers = methodMetadata.getExecutionHandlers();
        executionHandlers.forEach(handler => {
            handler(instance, methodMetadata, params, args);
        });
        state.status = RequestStatus.LOADING;
        let signal = params.signal;
        if (signal) {
            signal = mergeAbortSignal(
                params.signal,
                this.abortController.signal
            );
        } else {
            signal = lastExecutionAbortController
                ? mergeAbortSignal(
                      lastExecutionAbortController.signal,
                      this.abortController.signal
                  )
                : this.abortController.signal;
        }
        const allInterceptors = method.getAlInterceptors(instance);
        const sendRequest = allInterceptors.reduceRight(
            (next, interceptor) =>
                (method: RequestMethod, params: ExecuteRequestMethodParams) => {
                    return interceptor.invoke(method, params, next);
                },
            async (
                method: RequestMethod,
                params: ExecuteRequestMethodParams
            ): Promise<HttpResponse> => {
                state.status = RequestStatus.OPENED;
                const response = await method.invoke(instance, {
                    ...params,
                    signal
                });
                state.status = RequestStatus.LOADING;
                await this.handleResponse(response, state);
                return response;
            }
        );
        sendRequest(method, params).catch(error => {
            state.error(ResourceError.wrap(error));
        });
        return state;
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
    protected async handleResponse(
        response: HttpResponse,
        state: ResourceExecutionState<T, B>
    ): Promise<void> {
        const httpStatus = await response.status();
        state.headerReceived(await response.headers(), httpStatus);
        if (httpStatus < 200 || httpStatus >= 400) {
            await this.handleHttpErrorResponse(response);
        } else {
            for await (const data of this.resolveResponseBody(response)) {
                state.next(data as T);
            }
            state.status = RequestStatus.SUCCESS;
            state.complete();
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

        // Use the factory to create the appropriate HTTP status error
        const httpError = HttpStatusErrorFactory.createError(
            httpStatus,
            response.init.method.toString(),
            headers,
            responseBody
        );

        throw httpError;
    }
}
