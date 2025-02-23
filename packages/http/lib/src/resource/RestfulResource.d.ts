import { ExecutableResource, EXECUTE, Resource } from './Resource';
import { ResourceStatus } from './ResourceStatus';
export declare abstract class RestfulResource<T> extends Resource<T> implements ExecutableResource {
    get data(): T;
    get error(): unknown;
    protected get status(): ResourceStatus;
    protected set status(status: ResourceStatus);
    [EXECUTE](args: unknown[]): void;
}
