import { HttpRequestOptions } from '../types/HttpRequestOptions';
import { useData } from './useData';

export function usePlainText(options: HttpRequestOptions) {
    return useData<string>(options, (blob: Blob) => {
        return blob.text();
    });
}
