import { APPLICATION_CONTEXT } from '../core/EndpointMembers';
import { Interceptor } from '../core/Interceptor';
import { decorateEndpointMethod } from '../helper/decorateEndpointMethod';
import { RequestMethodMetadata } from '../metadata/RequestMethodMetadata';
import { EXTRA_METADATA_MUTATE, EXTRA_METADATA_SWR_KEYGEN } from './consts';
import { SWRService } from './SWRService';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Mutate(key: string | ((...args: any[]) => string)) {
    return decorateEndpointMethod(
        (
            clazz: NewableFunction,
            methodName: string | symbol,
            methodMetadata: RequestMethodMetadata
        ) => {
            methodMetadata.setExtra(EXTRA_METADATA_SWR_KEYGEN, key);
            methodMetadata.setExtra(EXTRA_METADATA_MUTATE, true);
            methodMetadata.appendInterceptor({
                invoke: (instance, method, params, next) => {
                    return next(instance, method, params).then(result => {
                        const swrService =
                            instance[APPLICATION_CONTEXT].getInstance(
                                SWRService
                            );
                        const args = params.args;
                        const _keygen = methodMetadata.getExtra<
                            | string
                            | ((...args: unknown[]) => string)
                            | undefined
                        >(EXTRA_METADATA_SWR_KEYGEN);
                        const key = (() => {
                            if (typeof _keygen === 'string') {
                                return _keygen;
                            }
                            if (typeof _keygen === 'function') {
                                return _keygen(...args);
                            }
                            return method.resolveURL(params);
                        })();
                        const swrInstance = swrService.obtainInstance(key);
                        swrInstance?.mutate();
                        return result;
                    });
                }
            } as Interceptor);
        }
    );
}
