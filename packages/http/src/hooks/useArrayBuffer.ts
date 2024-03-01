import { HttpRequestOptions } from '../types/HttpRequestOptions';
import { useData } from './useData';

export function useArrayBuffer(options: HttpRequestOptions) {
    return useData<ArrayBuffer>(options, (blob: Blob) => {
        return blob.arrayBuffer();
    });
}
