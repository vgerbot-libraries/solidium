import { HttpHeadersImpl } from '../core/HttpHeadersImpl';
import { SSEResource } from '../sse/SSEResource';
import { CreateResourceOptions } from '../types/CreateResourceOptions';
import { useResource } from './useResource';

export function useSSE<T>(
    options: CreateResourceOptions,
    chunkParser: (chunk: string) => T
) {
    const headers = options.headers || new HttpHeadersImpl();
    headers.set('Accept', 'text/event-stream');
    const worker = useResource({
        ...options,
        headers,
        disableCache: true
    });
    return new SSEResource(worker, chunkParser);
}
