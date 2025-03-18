import { FetchRequestAdapter } from '../adapter/FetchRequestAdapter';
import { getExecutionContext } from '../core/execution-context';
import { JSONSSEResource } from '../resource/JSONSSEResource';
import { execute } from './execute';

export function jsonsse<T>(...args: unknown[]) {
    const context = getExecutionContext();
    if (!context) {
        throw new Error(
            'No request context. Make sure to call `request` only within endpoint methods.'
        );
    }
    context.params.adapter = FetchRequestAdapter;
    return execute<T, JSONSSEResource<T>>(args, JSONSSEResource);
}
