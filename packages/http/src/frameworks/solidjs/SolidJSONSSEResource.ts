import { InstanceScope, Scope } from '@vgerbot/ioc';
import { Signal } from '@vgerbot/solidium';
import { Resource, SET_DATA, SET_ERROR } from '../../resource/Resource';
import { ResourceStatus } from '../../resource/ResourceStatus';

import { ResourceError } from '../../resource/ResourceError';

const DATA = Symbol('data');
const MESSAGES = Symbol('messages');
const ERROR = Symbol('error');
const STATUS = Symbol('status');

@Scope(InstanceScope.TRANSIENT)
export class SolidJSONSSEResource<T> extends Resource<T> {
    @Signal()
    private [MESSAGES]: T[] = [];
    @Signal()
    private [DATA]!: T;
    @Signal()
    private [ERROR]!: ResourceError | null;
    @Signal()
    private [STATUS]: ResourceStatus = ResourceStatus.IDLE;
    get messages() {
        return this[MESSAGES];
    }
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
        this[MESSAGES] = this[MESSAGES].concat(data);
        this[DATA] = data;
    }
    protected [SET_ERROR](error: ResourceError | null): void {
        this[ERROR] = error;
    }
}
