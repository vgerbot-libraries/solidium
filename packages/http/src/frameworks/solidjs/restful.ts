import { solidjsRequest } from './solidjs-request';
import { SolidRestfulResource } from './SolidRestfulResource';

export function restfull<T>(...args: unknown[]) {
    return solidjsRequest<T, SolidRestfulResource<T>>(
        args,
        SolidRestfulResource
    );
}
