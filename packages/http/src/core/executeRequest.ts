import { RequestMethodMetadata } from '../metadata/RequestMethodMetadata';
import { EndpointInstance } from './EndpointInstance';
import { ExecuteRequestMethodParams } from './ExecuteRequestParams';

export interface ExecutionContext {
    instance: EndpointInstance;
    method: RequestMethodMetadata;
    params: ExecuteRequestMethodParams;
}

let executionContext: ExecutionContext | undefined;

export function getExecutionContext() {
    return executionContext;
}

export function executeRequest(
    instance: EndpointInstance,
    methodMetadata: RequestMethodMetadata,
    args: unknown[],
    originFunction: Function
) {
    const params = {
        signal: methodMetadata.getSignal(),
        headers: methodMetadata.getHeaders().clone(),
        pathVariables: {},
        queryParams: {},
        adapter: methodMetadata.getAdapter()
    };
    executionContext = {
        instance,
        method: methodMetadata,
        params
    };
    return originFunction.apply(instance, args);
}
