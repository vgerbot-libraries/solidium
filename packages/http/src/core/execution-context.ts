import type { EndpointInstance } from "./EndpointInstance";
import type { ExecuteRequestMethodParams } from "./ExecuteRequestParams";
import type { RequestMethod } from "./RequestMethod";

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
