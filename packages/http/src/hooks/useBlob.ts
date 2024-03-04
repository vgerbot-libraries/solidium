import { HttpRequestOptions } from '../types/HttpRequestOptions';
import { useData } from './useData';

export function useBlob(options: HttpRequestOptions) {
    return useData(options, blob => Promise.resolve(blob));
}
