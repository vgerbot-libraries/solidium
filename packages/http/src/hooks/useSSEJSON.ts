import { CreateResourceOptions } from '../types/CreateResourceOptions';
import { useSSE } from './useSSE';

export function useSSEJSON<T>(options: CreateResourceOptions) {
    return useSSE<T>(options, (json: string) => {
        return JSON.parse(json);
    });
}
