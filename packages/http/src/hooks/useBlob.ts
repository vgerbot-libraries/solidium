import { CreateResourceOptions } from '../types/CreateResourceOptions';
import { useData } from './useData';

export function useBlob(options: CreateResourceOptions) {
    return useData(options, blob => Promise.resolve(blob));
}
