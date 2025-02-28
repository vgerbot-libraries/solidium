import { FetchRequestAdapter } from '../../adapter/FetchRequestAdapter';
import { getExecutionContext } from '../../core/execution-context';
import { solidjsRequest } from './solidjs-request';
import { SolidJSONSSEResource } from './SolidJSONSSEResource';

export function jsonsse<T>(...args: unknown[]) {
    const context = getExecutionContext();
    if (!context) {
        throw new Error(
            'No request context. Make sure to call `request` only within endpoint methods.'
        );
    }
    context.params.adapter = FetchRequestAdapter;
    return solidjsRequest<T, SolidJSONSSEResource<T>>(
        args,
        SolidJSONSSEResource
    );
}
