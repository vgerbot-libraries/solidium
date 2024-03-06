import { CreateResourceOptions } from '../types/CreateResourceOptions';
import { useData } from './useData';

export function useArrayBuffer(options: CreateResourceOptions) {
    return useData<ArrayBuffer>(options, (blob: Blob) => {
        return blob.arrayBuffer();
    });
}
