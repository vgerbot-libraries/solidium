import { appendExecHandler } from '../common/appendExecHandler';

export function PathVariable(
    name: string,
    defaultValue?: string | number | boolean
) {
    return function (
        target: object,
        methodName: string,
        parameterIndex: number
    ) {
        appendExecHandler(
            target.constructor,
            methodName,
            (instance, metadata, params, args) => {
                const value = args[parameterIndex];
                params.pathVariables[name] = (value ?? defaultValue) + '';
            }
        );
    };
}
