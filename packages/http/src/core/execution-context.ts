import { EndpointInstance } from './EndpointInstance';
import { ExecuteRequestMethodParams } from './ExecuteRequestParams';
import { RequestMethod } from './RequestMethod';

export interface ExecutionContext {
    instance: EndpointInstance;
    method: RequestMethod;
    params: ExecuteRequestMethodParams;
}

let executionContext: ExecutionContext | undefined;

export function getExecutionContext() {
    return executionContext;
}

export function setExecutionContext(context?: ExecutionContext) {
    executionContext = context;
}
