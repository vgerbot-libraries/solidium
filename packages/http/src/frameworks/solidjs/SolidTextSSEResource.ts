import { Signal } from '@vgerbot/solidium';
import { Scope, InstanceScope } from '@vgerbot/ioc';
import { Resource, SET_DATA, SET_ERROR } from '../../resource/Resource';
import { ResourceStatus } from '../../resource/ResourceStatus';

import { HttpResponse } from '../../core/HttpResponse';
import { ResourceError } from '../../resource/ResourceError';

const DATA = Symbol('data');
const ERROR = Symbol('error');
const STATUS = Symbol('status');

@Scope(InstanceScope.TRANSIENT)
export class SolidTextSSEResource<T> extends Resource<T> {
    @Signal()
    private [DATA]!: T;
    @Signal()
    private [ERROR]!: ResourceError | null;
    @Signal()
    private [STATUS]: ResourceStatus = ResourceStatus.IDLE;
    get data(): T {
        return this[DATA];
    }
    get error(): ResourceError | null {
        return this[ERROR];
    }
    protected get status(): ResourceStatus {
        return this[STATUS];
    }
    protected set status(status: ResourceStatus) {
        this[STATUS] = status;
    }
    protected [SET_DATA](data: T): void {
        this[DATA] = data;
    }
    protected [SET_ERROR](error: ResourceError | null): void {
        this[ERROR] = error;
    }

    protected async handleResponse(response: HttpResponse): Promise<void> {
        try {
            for await (const data of response.textStream()) {
                this[SET_DATA](data as T);
            }
        } catch (error) {
            // Re-wrap other errors in ResourceError
            this.status = ResourceStatus.ERROR;
            this[SET_ERROR](new ResourceError(error));
            throw error;
        }
    }
    protected async handleHttpErrorResponse(
        response: HttpResponse
    ): Promise<void> {
        const httpStatus = await response.status();
        // Create generic HTTP status error
        const httpError = new Error(`HTTP Error ${httpStatus}`);
        this.status = ResourceStatus.ERROR;
        this[SET_ERROR](new ResourceError(httpError));
        throw httpError;
    }
}
