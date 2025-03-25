import { EndpointMetadata } from '../metadata/EndpointMetadata';
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
export function SWR(config: SWRDecoratorConfig) {
    return (
        target: object,
        propertyKey: ClassMethodDecoratorContext | string | symbol
    ) => {
        const methodName =
            typeof propertyKey === 'object' ? propertyKey.name : propertyKey;
        const methodMetadata = EndpointMetadata.from(
            target.constructor
        ).getMethodMetadata(methodName);
        methodMetadata.setExtra(EXTRA_METADATA_SWR_KEYGEN, config.key);

        methodMetadata.setExtra(EXTRA_METADATA_SWR_CONFIG, config);
    };
}
