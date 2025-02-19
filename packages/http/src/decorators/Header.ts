import { appendExecHandler } from '../common/appendExecHandler';

export function Header(name: string, defaultValue?: string | string[]) {
    return function (
        target: Function,
        methodName: string,
        parameterIndex: number
    ) {
        appendExecHandler(
            target,
            methodName,
            (instance, metadata, params, args) => {
                const value =
                    (args[parameterIndex] as string | string[] | undefined) ??
                    defaultValue;
                if (value) {
                    params.headers.append(
                        name,
                        ...(Array.isArray(value) ? value : [value])
                    );
                }
            }
        );
    };
}
