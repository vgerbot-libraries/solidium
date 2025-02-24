import { appendExecHandler } from '../common/appendExecHandler';
import { isBodyInit } from '../common/isBodyInit';

export function Payload() {
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
                if (isBodyInit(value)) {
                    params.payload = value;
                } else {
                    params.headers.set('Content-Type', 'application/json');
                    params.payload = JSON.stringify(value);
                }
            }
        );
    };
}
