import { EndpointMetadata } from '../metadata/EndpointMetadata';
import { ExecutionHandler } from '../metadata/RequestMethodMetadata';

export function appendExecHandler(
    target: Function,
    methodName: string | symbol,
    handler: ExecutionHandler
) {
    const metadata =
        EndpointMetadata.from(target).getMethodMetadata(methodName);
    metadata?.appendExecutionHandler(handler);
}
