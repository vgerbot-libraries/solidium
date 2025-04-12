import { ApplicationContext, Generate, Inject } from '@vgerbot/ioc';
import { lazyMember } from '@vgerbot/lazy';
import { RequestAdapterConstructor } from '../adapter/RequestAdapter';
import { Class } from '../common/Class';
import { EndpointMetadata } from '../metadata/EndpointMetadata';
import {
    ABORT_CONTROLLER,
    ADAPTER,
    APPLICATION_CONTEXT,
    CONSTRUCT_INTERCEPTORS,
    GET_INTERCEPTORS,
    METHODS
} from './EndpointMembers';
import {
    Interceptor,
    InterceptorConstructor,
    InterceptorTypeIdentifier,
    isInterceptor
} from './Interceptor';
import { RequestMethod } from './RequestMethod';

export interface EndpointInstance {
    [METHODS]: Map<string | symbol, RequestMethod>;
    [GET_INTERCEPTORS]: (
        exclude?: Array<InterceptorTypeIdentifier | Interceptor>
    ) => Interceptor[];
    [ADAPTER]?: RequestAdapterConstructor;
    [CONSTRUCT_INTERCEPTORS]: (
        interceptors: Array<InterceptorTypeIdentifier | Interceptor>
    ) => Interceptor[];
    [ABORT_CONTROLLER]: AbortController;
    [APPLICATION_CONTEXT]: ApplicationContext;
}

export function buildEndpointClass(
    endpointClass: Class<EndpointInstance>,
    metadata: EndpointMetadata
) {
    Reflect.set(
        endpointClass.prototype,
        GET_INTERCEPTORS,
        function (
            this: EndpointInstance,
            exclude?: Array<InterceptorTypeIdentifier | Interceptor>
        ) {
            return metadata
                .getInterceptors()
                .filter(it => !exclude?.includes(it))
                .map(identifier => {
                    if (isInterceptor(identifier)) {
                        return identifier;
                    }
                    return this[APPLICATION_CONTEXT].getInstance(identifier);
                })
                .flat();
        }
    );

    Reflect.set(endpointClass.prototype, ADAPTER, metadata.getAdaptor());

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

    lazyMember(() => new AbortController())(
        endpointClass.prototype,
        ABORT_CONTROLLER
    );
    lazyMember(() => {
        const methods = new Map();
        metadata.getMethods().forEach((methodMetadata, methodName) => {
            methods.set(
                methodName,
                new RequestMethod(methodName, metadata, methodMetadata)
            );
        });
        return methods;
    })(endpointClass.prototype, METHODS);

    Inject(ApplicationContext)(endpointClass.prototype, APPLICATION_CONTEXT);
}
