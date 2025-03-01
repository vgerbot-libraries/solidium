import { Signal } from '@vgerbot/solidium';
import { Scope, InstanceScope } from '@vgerbot/ioc';
import { SET_DATA, SET_ERROR } from '../../resource/Resource';
import { ResourceStatus } from '../../resource/ResourceStatus';

import { JSONSSEResource } from '../../resource/JSONSSEResource';

const DATA = Symbol('data');
const MESSAGES = Symbol('messages');
const ERROR = Symbol('error');
const STATUS = Symbol('status');

@Scope(InstanceScope.TRANSIENT)
export class SolidJSONSSEResource<T> extends JSONSSEResource<T> {
    @Signal()
    private [MESSAGES]: T[] = [];
    @Signal()
    private [DATA]!: T;
    @Signal()
    private [ERROR]!: unknown;
    @Signal()
    private [STATUS]: ResourceStatus = ResourceStatus.IDLE;
    get messages() {
        return this[MESSAGES];
    }
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
        this[MESSAGES] = this[MESSAGES].concat(data);
        this[DATA] = data;
    }
    protected [SET_ERROR](error: unknown): void {
        this[ERROR] = error;
    }
}
