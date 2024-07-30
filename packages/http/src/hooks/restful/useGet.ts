import { RestfulResourceOptions } from '../../types/CreateResourceOptions';
import { HttpMethod } from '../../types/HttpMethod';
import { useJSON } from '../useJSON';

export function useGet(options: string | Omit<RestfulResourceOptions, 'body'>) {
    if (typeof options === 'string') {
        const searchParamsStr = options.split('?')[1];
        const searchParams = new URLSearchParams(searchParamsStr);
        return useJSON({
            path: options,
            search: searchParams,
            method: HttpMethod.GET
        });
    }
    return useJSON(options);
}
