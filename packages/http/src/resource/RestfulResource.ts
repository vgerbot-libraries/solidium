import { METHODS } from '../core/EndpointInstance';
import { getExecutionContext } from '../core/executeRequest';
import { ExecutableResource, EXECUTE, Resource } from './Resource';
import { ResourceStatus } from './ResourceStatus';

export abstract class RestfulResource<T>
    extends Resource<T>
    implements ExecutableResource
{
    get data(): T {
        throw new Error('Method not implemented.');
    }
    get error(): unknown {
        throw new Error('Method not implemented.');
    }
    protected get status(): ResourceStatus {
        throw new Error('Method not implemented.');
    }
    protected set status(status: ResourceStatus) {
        throw new Error('Method not implemented.');
    }
    [EXECUTE](args: unknown[]): void {
        const context = getExecutionContext();
        if (!context) {
            throw new Error(
                'No request context. Make sure to call `request` only within endpoint methods.'
            );
        }
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
        // swr
    }
}
