import { APPLICATION_CONTEXT } from '../core/EndpointMembers';
import { Interceptor } from '../core/Interceptor';
import { decorateEndpointMethod } from '../helper/decorateEndpointMethod';
import { RequestMethodMetadata } from '../metadata/RequestMethodMetadata';
import { EXTRA_METADATA_MUTATE } from './consts';
import { SWRService } from './SWRService';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SWRMutation(_keygen: string | ((...args: any[]) => string)) {
    return decorateEndpointMethod(
        (
            clazz: NewableFunction,
            methodName: string | symbol,
            methodMetadata: RequestMethodMetadata
        ) => {
            methodMetadata.setExtra(EXTRA_METADATA_MUTATE, true);
            methodMetadata.appendInterceptor({
                invoke: async (instance, method, params, next) => {
                    const result = await next(instance, method, params);

                    const swrService =
                        instance[APPLICATION_CONTEXT].getInstance(SWRService);
                    const args = params.args;

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
                }
            } as Interceptor);
        }
    );
}
