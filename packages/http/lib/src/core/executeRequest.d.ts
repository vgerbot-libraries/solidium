import { RequestMethodMetadata } from '../metadata/RequestMethodMetadata';
import { EndpointInstance } from './EndpointInstance';
import { ExecuteRequestMethodParams } from './ExecuteRequestParams';
export interface ExecutionContext {
    instance: EndpointInstance;
    method: RequestMethodMetadata;
    params: ExecuteRequestMethodParams;
}
export declare function getExecutionContext(): ExecutionContext | undefined;
export declare function executeRequest(instance: EndpointInstance, methodMetadata: RequestMethodMetadata, args: unknown[], originFunction: Function): any;
