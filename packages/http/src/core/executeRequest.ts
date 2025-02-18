import { RequestMethodMetadata } from '../metadata/RequestMethodMetadata';
import { EndpointInstance } from './buildEndpointClass';

export function executeReques(
    instance: EndpointInstance,
    method: RequestMethodMetadata,
    args: unknown[],
    originFunction: Function
) {
    //
}
