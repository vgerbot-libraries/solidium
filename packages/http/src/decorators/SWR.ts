import { EndpointMetadata } from '../metadata/EndpointMetadata';
import { SWRConfig } from '../swr/SWRConfig';

export function SWR(config: SWRConfig) {
    return (
        target: object,
        propertyKey: ClassMethodDecoratorContext | string | symbol
    ) => {
        const methodName =
            typeof propertyKey === 'object' ? propertyKey.name : propertyKey;
        const methodMetadata = EndpointMetadata.from(
            target.constructor
        ).getMethodMetadata(methodName);
        methodMetadata?.appendSWRConfig(config);
    };
}
