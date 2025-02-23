import { ResourceStatus } from './ResourceStatus';
export declare const EXECUTE: unique symbol;
export declare abstract class Resource<T> {
    abstract get data(): T;
    abstract get error(): unknown;
    protected abstract get status(): ResourceStatus;
    protected abstract set status(status: ResourceStatus);
    get idle(): boolean;
    get pending(): boolean;
    get success(): boolean;
    get aborted(): boolean;
    get failure(): boolean;
}
export interface ExecutableResource {
    [EXECUTE](args: unknown[]): void;
}
