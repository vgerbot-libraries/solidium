import { EndpointMetadata } from '../metadata/EndpointMetadata';
import { RequestMethodMetadata } from '../metadata/RequestMethodMetadata';
import { type EndpointInstance } from './EndpointInstance';
import { ExecuteRequestMethodParams } from './ExecuteRequestParams';
import { HttpResponse } from './HttpResponse';
export declare class RequestMethod {
    readonly name: string | symbol;
    readonly endpointMetadata: EndpointMetadata;
    private readonly metadata;
    private readonly url;
    private readonly baseInterceptors;
    constructor(name: string | symbol, endpointMetadata: EndpointMetadata, metadata: RequestMethodMetadata);
    invoke(instance: EndpointInstance, params: ExecuteRequestMethodParams): Promise<HttpResponse>;
    private createAdapter;
}
