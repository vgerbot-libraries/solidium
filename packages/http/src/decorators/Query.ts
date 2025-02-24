import { appendExecHandler } from '../common/appendExecHandler';

export function Query(
    name: string,
    defaultValue?: string | number | boolean | Array<string | number | boolean>
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
                const value = args[parameterIndex] ?? defaultValue;
                if (Array.isArray(value)) {
                    value.forEach(value => {
                        params.queryParams.append(name, value);
                    });
                } else if (value !== null && value !== undefined) {
                    params.queryParams.set(name, value + '');
                }
            }
        );
    };
}
