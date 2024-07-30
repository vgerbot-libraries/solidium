import { RestfulResourceOptions } from '../../types/CreateResourceOptions';
import { HttpMethod } from '../../types/HttpMethod';
import { useJSON } from '../useJSON';

export function usePost(options: RestfulResourceOptions) {
    return useJSON({
        ...options,
        method: HttpMethod.POST
    });
}
