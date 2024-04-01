import { SSEResource } from '../sse/SSEResource';
import { CreateResourceOptions } from '../types/CreateResourceOptions';
export declare function useSSE<T>(options: CreateResourceOptions, chunkParser: (chunk: string) => T): SSEResource<T>;
