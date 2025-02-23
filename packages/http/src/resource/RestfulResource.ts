import { cloneParams } from '../common/cloneParams';
import { METHODS, SWR_INSTANCES } from '../core/EndpointMembers';
import { getExecutionContext } from '../core/executeRequest';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { SWRInstance } from '../swr/SWRInstance';
import {
    ExecutableResource,
    EXECUTE,
    Resource,
    SET_DATA,
    SET_ERROR
} from './Resource';
import { ResourceStatus } from './ResourceStatus';

export abstract class RestfulResource<T>
    extends Resource<T>
    implements ExecutableResource
{
    abstract get data(): T;
    abstract get error(): unknown;

    protected abstract [SET_DATA](data: T): void;
    protected abstract [SET_ERROR](error: unknown): void;

    protected abstract get status(): ResourceStatus;
    protected abstract set status(status: ResourceStatus);
    async [EXECUTE](args: unknown[]): Promise<void> {
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
        const executeRequest = async (params: ExecuteRequestMethodParams) => {
            this.status = ResourceStatus.PENDING;
            try {
                const response = await method.invoke(instance, params);
                this.status = ResourceStatus.SUCCESS;
                const data = (await response.json()) as T;
                this[SET_DATA](data);
                return response;
            } catch (error) {
                this.status = ResourceStatus.ERROR;
                this[SET_ERROR](error);
                throw error;
            }
        };
        const swrConfig = methodMetadata.getSWRConfig();
        if (swrConfig) {
            const swrInstance = new SWRInstance(
                methodMetadata.name.toString(),
                () => {
                    return executeRequest(cloneParams(params));
                },
                swrConfig
            );
            instance[SWR_INSTANCES].set(methodMetadata.name, swrInstance);

            await swrInstance.mutate();
        } else {
            await executeRequest(params);
        }
    }
}
