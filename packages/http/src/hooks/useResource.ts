import { CreateResourceOptions } from '../types/CreateResourceOptions';
import { useHttpClient } from './useHttpClient';

export function useResource(options: CreateResourceOptions) {
    const client = useHttpClient();
    return client.createResource(options);
}
