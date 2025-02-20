import { ResourceStatus } from './ResourceStatus';

export const EXECUTE = Symbol('execute');

export abstract class Resource<T> {
    abstract get data(): T;
    abstract get error(): unknown;

    protected abstract get status(): ResourceStatus;
    protected abstract set status(status: ResourceStatus);

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
}

export interface ExecutableResource {
    [EXECUTE](args: unknown[]): void;
}
