import { ApplicationContext, Generate } from '@vgerbot/ioc';
import { Class } from '../common/Class';
import { EndpointMetadata } from '../metadata/EndpointMetadata';
import { RequestMethod } from './RequestMethod';
import {
    METHODS,
    INTERCEPTORS,
    ADAPTER,
    CONSTRUCT_INTERCEPTORS,
    SWR_INSTANCES,
    ABORT_CONTROLLER
} from './EndpointMembers';
import {
    Interceptor,
    InterceptorConstructor,
    InterceptorTypeIdentifier,
    isInterceptor
} from './Interceptor';
import { RequestAdapterConstructor } from '../adapter/RequestAdapter';
import { SWRInstance } from '../swr/SWRInstance';
import { lazyMember } from '@vgerbot/lazy';
import { HttpResponse } from './HttpResponse';

export interface EndpointInstance {
    [METHODS]: Map<string | symbol, RequestMethod>;
    [INTERCEPTORS]: Interceptor[];
    [ADAPTER]?: RequestAdapterConstructor;
    [CONSTRUCT_INTERCEPTORS]: (
        interceptors: Array<InterceptorTypeIdentifier | Interceptor>
    ) => Interceptor[];
    [SWR_INSTANCES]: Map<string | symbol, SWRInstance<HttpResponse>>;
    [ABORT_CONTROLLER]: AbortController;
}

export function buildEndpointClass(
    endpointClass: Class<EndpointInstance>,
    metadata: EndpointMetadata
) {
    Generate<EndpointInstance, Interceptor[]>((appCtx: ApplicationContext) => {
        return metadata
            .getInterceptors()
            .map(identifier => {
                if (isInterceptor(identifier)) {
                    return identifier;
                }
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

    lazyMember(() => new Map())(endpointClass.prototype, SWR_INSTANCES);
    lazyMember(() => new AbortController())(
        endpointClass.prototype,
        ABORT_CONTROLLER
    );
}
