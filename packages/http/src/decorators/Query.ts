import { appendExecHandler } from '../common/appendExecHandler';

export function Query(name: string, defaultValue?: string | number | boolean) {
    return function (
        target: Function,
        methodName: string,
        parameterIndex: number
    ) {
        appendExecHandler(
            target,
            methodName,
            (instance, metadata, params, args) => {
                const value = args[parameterIndex];
                params.queryParams[name] = (value ?? defaultValue) + '';
            }
        );
    };
}
