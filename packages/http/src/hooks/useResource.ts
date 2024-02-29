import { HttpRequestOptions } from '../types/HttpRequestOptions';
import { useHttpClient } from './useHttpClient';

export function useResource(options: HttpRequestOptions) {
    const client = useHttpClient();
    return client.createResource(options);
}
