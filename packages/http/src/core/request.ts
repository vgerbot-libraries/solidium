import { METHODS } from './EndpointMembers';
import { getExecutionContext } from './executeRequest';

export function request(...args: unknown[]) {
    const context = getExecutionContext();
    if (!context) {
        throw new Error(
            'No request context. Make sure to call `request` only within endpoint methods.'
        );
    }
    const { instance, method: methodMetadata, params } = context;
    const method = instance[METHODS].get(methodMetadata.name);
    if (!method) {
        throw new Error(`Not found method ${methodMetadata.name.toString()}`);
    }
    const executionHandlers = methodMetadata.getExecutionHandlers();
    executionHandlers.forEach(handler => {
        handler(instance, methodMetadata, params, args);
    });
    return method.invoke(instance, params);
}
