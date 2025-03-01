import { mergeAbortSignal } from '../common/mergeAbortSignal';
import { METHODS } from '../core/EndpointMembers';
import { ExecutionContext } from '../core/execution-context';
import { HttpResponse } from '../core/HttpResponse';
import { ResourceStatus } from './ResourceStatus';

export const EXECUTE = Symbol('execute');
export const SET_DATA = Symbol('setData');
export const SET_ERROR = Symbol('setError');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyResource = Resource<any>;

export abstract class Resource<T> {
    abstract get data(): T;
    abstract get error(): unknown;

    protected abstract [SET_DATA](data: T): void;
    protected abstract [SET_ERROR](error: unknown): void;

    protected abstract get status(): ResourceStatus;
    protected abstract set status(status: ResourceStatus);
    protected readonly abortController = new AbortController();
    constructor() {
        this.abortController.signal.addEventListener('abort', () => {
            this.status = ResourceStatus.ABORTED;
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
            throw new Error(
                `Not found method ${methodMetadata.name.toString()}`
            );
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
            this.status = ResourceStatus.ERROR;
            this[SET_ERROR](error);
            throw error;
        }
    }
    protected abstract handleResponse(response: HttpResponse): Promise<void>;
}
