import { EndpointMetadata } from '../metadata/EndpointMetadata';
import { SWR_CONFIG_EXTRA_KEY } from './consts';
import { SWRConfig } from './SWRConfig';

type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

export interface SWRDecoratorConfig extends DeepPartial<SWRConfig> {
    key?: string | ((args: unknown[]) => string);
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
        methodMetadata.setExtra(SWR_CONFIG_EXTRA_KEY, config);
    };
}
