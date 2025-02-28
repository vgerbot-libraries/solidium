import { Signal } from '@vgerbot/solidium';
import { Scope, InstanceScope } from '@vgerbot/ioc';
import { Resource, SET_DATA, SET_ERROR } from '../../resource/Resource';
import { ResourceStatus } from '../../resource/ResourceStatus';

import { HttpResponse } from '../../core/HttpResponse';

const DATA = Symbol('data');
const ERROR = Symbol('error');
const STATUS = Symbol('status');

@Scope(InstanceScope.TRANSIENT)
export class SolidTextSSEResource<T> extends Resource<T> {
    @Signal()
    private [DATA]!: T;
    @Signal()
    private [ERROR]!: unknown;
    @Signal()
    private [STATUS]: ResourceStatus = ResourceStatus.IDLE;
    get data(): T {
        return this[DATA];
    }
    get error(): unknown {
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
    protected [SET_ERROR](error: unknown): void {
        this[ERROR] = error;
    }
    protected async handleResponse(response: HttpResponse): Promise<void> {
        for await (const data of response.textStream()) {
            this[SET_DATA](data as T);
        }
    }
}
