import { HttpRequestOptions } from '../types/HttpRequestOptions';
import { useData } from './useData';

export function useJSON<T>(options: HttpRequestOptions) {
    return useData<T>(options, (blob: Blob) => {
        return blob.text().then(text => JSON.parse(text));
    });
}
