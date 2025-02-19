import { ApplicationContext, Generate } from '@vgerbot/ioc';
import { Class } from '../common/Class';
import { EndpointMetadata } from '../metadata/EndpointMetadata';
import { RequestMethod } from './RequestMethod';
import {
    Interceptor,
    InterceptorConstructor,
    InterceptorTypeIdentifier
} from './Interceptor';
import { RequestAdapterConstructor } from '../adapter/RequestAdapter';

export interface EndpointInstance {
    [METHODS]: Map<string | symbol, RequestMethod>;
    [INTERCEPTORS]: Interceptor[];
    [ADAPTER]?: RequestAdapterConstructor;
    [CONSTRUCT_INTERCEPTORS]: (
        interceptors: Array<InterceptorTypeIdentifier>
    ) => Interceptor[];
}
export const METHODS = Symbol('endpoint-request-methods');
export const INTERCEPTORS = Symbol('endpoint-interceptors');
export const ADAPTER = Symbol('endpoint-adapter');
export const CONSTRUCT_INTERCEPTORS = Symbol('endpoint-construct-interceptors');

export function buildEndpointClass(
    endpointClass: Class<EndpointInstance>,
    metadata: EndpointMetadata
) {
    Generate<EndpointInstance, Interceptor[]>((appCtx: ApplicationContext) => {
        return metadata
            .getInterceptors()
            .map(identifier => {
                return appCtx.getInstance(identifier);
            })
            .flat();
    })(endpointClass.prototype, INTERCEPTORS);

    Reflect.set(endpointClass.prototype, ADAPTER, metadata.getAdaptor());

    const methods = new Map();
    metadata.getMethods().forEach((methodMetadata, methodName) => {
        methods.set(
            methodName,
            new RequestMethod(methodName, metadata, methodMetadata)
        );
    });
    Reflect.set(endpointClass.prototype, METHODS, methods);

    Generate<
        EndpointInstance,
        (
            interceptors: Array<InterceptorConstructor | string | symbol>
        ) => Interceptor[]
    >(function (appCtx: ApplicationContext) {
        return (
            interceptors: Array<InterceptorConstructor | string | symbol>
        ) => {
            return interceptors
                .map(identifier => {
                    return appCtx.getInstance(identifier);
                })
                .flat();
        };
    })(endpointClass.prototype, CONSTRUCT_INTERCEPTORS);
}
