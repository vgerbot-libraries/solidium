import { EndpointMetadata } from '../metadata/EndpointMetadata';

export function PathVariable(
    name: string,
    defaultValue?: string | number | boolean
) {
    return function (
        target: Function,
        methodName: string,
        parameterIndex: number
    ) {
        const metadata =
            EndpointMetadata.from(target).getMethodMetadata(methodName);
        metadata?.appendExecutionHandler((metadata, params, args) => {
            const value = args[parameterIndex];
            params.pathVariables[name] = (value ?? defaultValue) + '';
        });
    };
}
