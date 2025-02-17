import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';

export type ExecutionHandler = (
    metadata: RequestMethodMetadata,
    params: ExecuteRequestMethodParams,
    args: unknown[]
) => void;

export class RequestMethodMetadata {
    private readonly executionHandlers: ExecutionHandler[] = [];

    appendExecutionHandler(handler: ExecutionHandler) {
        this.executionHandlers.push(handler);
    }
}
