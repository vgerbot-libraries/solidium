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

export function setExecutionContext(context?: ExecutionContext) {
    executionContext = context;
}
