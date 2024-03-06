import { DataResource } from '../resource/DataResource';
import { CreateResourceOptions } from '../types/CreateResourceOptions';
import { useResource } from './useResource';

export function useData<T>(
    options: CreateResourceOptions,
    parser: (blob: Blob) => Promise<T>
) {
    const res = useResource(options);
    return new DataResource<T>(res, parser);
}
