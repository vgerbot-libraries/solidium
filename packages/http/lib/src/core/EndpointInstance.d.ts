import { Class } from '../common/Class';
import { EndpointMetadata } from '../metadata/EndpointMetadata';
import { RequestMethod } from './RequestMethod';
import { METHODS, INTERCEPTORS, ADAPTER, CONSTRUCT_INTERCEPTORS } from './EndpointMembers';
import { Interceptor, InterceptorTypeIdentifier } from './Interceptor';
import { RequestAdapterConstructor } from '../adapter/RequestAdapter';
export interface EndpointInstance {
    [METHODS]: Map<string | symbol, RequestMethod>;
    [INTERCEPTORS]: Interceptor[];
    [ADAPTER]?: RequestAdapterConstructor;
    [CONSTRUCT_INTERCEPTORS]: (interceptors: Array<InterceptorTypeIdentifier | Interceptor>) => Interceptor[];
}
export declare function buildEndpointClass(endpointClass: Class<EndpointInstance>, metadata: EndpointMetadata): void;
