import { decorateEndpointMethod } from '../helper/decorateEndpointMethod';
import {
    CacheInterceptor,
    CacheInterceptorConfig
} from '../interceptors/CacheInterceptor';
import { RequestMethodMetadata } from '../metadata/RequestMethodMetadata';

export function Cache(config: CacheInterceptorConfig = {}) {
    return decorateEndpointMethod(
        (
            clazz: NewableFunction,
            methodName: string | symbol,
            methodMetadata: RequestMethodMetadata
        ) => {
            methodMetadata.appendInterceptor(new CacheInterceptor(config));
        }
    );
}
