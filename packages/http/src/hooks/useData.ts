import { DataResource } from '../resource/DataResource';
import { HttpRequestOptions } from '../types/HttpRequestOptions';
import { useResource } from './useResource';

export function useData<T>(
    options: HttpRequestOptions,
    parser: (blob: Blob) => Promise<T>
) {
    const res = useResource(options);
    return new DataResource<T>(res, parser);
}
