import { CreateResourceOptions } from '../types/CreateResourceOptions';
import { useData } from './useData';

export function usePlainText(options: CreateResourceOptions) {
    return useData<string>(options, (blob: Blob) => {
        return blob.text();
    });
}
