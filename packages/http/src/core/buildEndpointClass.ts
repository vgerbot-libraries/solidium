import { ApplicationContext, Generate } from '@vgerbot/ioc';
import { Class } from '../common/Class';
import { EndpointMetadata } from '../metadata/EndpointMetadata';
import { RequestEndpoint } from './RequestEndpoint';
import { RequestMethod } from './RequestMethod';
import { Interceptor } from './Interceptor';
import { RequestAdapterConstructor } from '../adapter/RequestAdapter';

export interface EndpointInstance {
    [ENDPOINT_INSTANCE]: RequestEndpoint;
    [ENDPOINT_REQUEST_METHODS]: Map<string | symbol, RequestMethod>;
    [ENDPOINT_INTERCEPTORS]: Interceptor[];
    [ENDPOINT_ADAPTER]?: RequestAdapterConstructor;
}
export const ENDPOINT_INSTANCE = Symbol('endpoint-instance');
export const ENDPOINT_REQUEST_METHODS = Symbol('endpoint-request-methods');
export const ENDPOINT_INTERCEPTORS = Symbol('endpoint-interceptors');
export const ENDPOINT_ADAPTER = Symbol('endpoint-adapter');

export function buildEndpointClass(
    endpointClass: Class<EndpointInstance>,
    metadata: EndpointMetadata
) {
    Generate<EndpointInstance, Interceptor[]>((appCtx: ApplicationContext) => {
        return metadata.getInterceptors().map(identifier => {
            return appCtx.getInstance(identifier) as Interceptor;
        });
    })(endpointClass.prototype, ENDPOINT_INTERCEPTORS);

    Reflect.set(
        endpointClass.prototype,
        ENDPOINT_ADAPTER,
        metadata.getAdaptor()
    );

    Generate<EndpointInstance, RequestEndpoint>(function (
        this: EndpointInstance
    ) {
        const endpoint = new RequestEndpoint({
            interceptors: this[ENDPOINT_INTERCEPTORS],
            adapter: this[ENDPOINT_ADAPTER],
            baseURL: metadata.getBaseURL(),
            timeout: metadata.getTimeout()
        });
        return endpoint;
    })(endpointClass.prototype, ENDPOINT_INSTANCE);

    Generate<EndpointInstance, Map<string | symbol, RequestMethod>>(function (
        this: EndpointInstance
    ) {
        const methods = new Map();
        metadata.getMethods().forEach((methodMetadata, methodName) => {
            methods.set(
                methodName,
                new RequestMethod(
                    this[ENDPOINT_INSTANCE],
                    methodMetadata.getHttpMethod(),
                    methodMetadata.getHeaders(),
                    methodMetadata.getAdapter(),
                    methodMetadata.getTimeout(),
                    methodMetadata.getPath()
                )
            );
        });
        return methods;
    })(endpointClass.prototype, ENDPOINT_REQUEST_METHODS);
}
