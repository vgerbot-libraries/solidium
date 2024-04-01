import { DataResource } from '../resource/DataResource';
import { CreateResourceOptions } from '../types/CreateResourceOptions';
export declare function useData<T>(options: CreateResourceOptions, parser: (blob: Blob) => Promise<T>): DataResource<T>;
