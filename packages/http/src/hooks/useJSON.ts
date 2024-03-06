import { CreateResourceOptions } from '../types/CreateResourceOptions';
import { useData } from './useData';

export function useJSON<T = unknown>(options: CreateResourceOptions) {
    return useData<T>(options, (blob: Blob) => {
        return blob.text().then(text => JSON.parse(text));
    });
}
