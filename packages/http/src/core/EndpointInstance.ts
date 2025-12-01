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
    HTTP_CONFIGURATION,
    METHODS
} from './EndpointMembers';
import {
    Interceptor,
    InterceptorConstructor,
    InterceptorTypeIdentifier,
    isInterceptor
} from './Interceptor';
import { RequestMethod } from './RequestMethod';
import { DEFAULT_HTTP_CONFIGURATION, HttpConfiguration } from './Http';

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
    [HTTP_CONFIGURATION]?: HttpConfiguration;
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
            const globalInterceptors =
                this[HTTP_CONFIGURATION]?.interceptors ?? [];
            return [...globalInterceptors, ...metadata.getInterceptors()]
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
            interceptors: Array<
                InterceptorConstructor | string | symbol | Interceptor
            >
        ) => {
            return interceptors
                .map(identifier => {
                    if (typeof identifier === 'object') {
                        return identifier;
                    }
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
    lazyMember((endpointInstance: EndpointInstance) => {
        return endpointInstance[APPLICATION_CONTEXT].getInstance(
            DEFAULT_HTTP_CONFIGURATION
        );
    })(endpointClass.prototype, HTTP_CONFIGURATION);
}
