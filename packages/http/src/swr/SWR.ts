import { decorateEndpointMethod } from '../helper/decorateEndpointMethod';
import { EXTRA_METADATA_SWR_CONFIG, EXTRA_METADATA_SWR_KEYGEN } from './consts';
import { SWRConfig } from './SWRConfig';

type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

export interface SWRDecoratorConfig extends DeepPartial<SWRConfig> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key?: string | ((...args: any[]) => string);
}
export function SWR(config: SWRDecoratorConfig = {}) {
    return decorateEndpointMethod((clazz, methodName, methodMetadata) => {
        methodMetadata.setExtra(EXTRA_METADATA_SWR_KEYGEN, config.key);
        methodMetadata.setExtra(EXTRA_METADATA_SWR_CONFIG, config);
    });
}
