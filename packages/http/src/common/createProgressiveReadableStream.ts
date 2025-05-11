import { readStream } from './readStream';

export function createProgressiveReadableStream(
    stream: ReadableStream<Uint8Array>,
    progress: (loaded: number) => void = () => void 0
) {
    let loaded = 0;
    const abortController = new AbortController();
    return new ReadableStream<ArrayBuffer>({
        start: async controller => {
            try {
                progress(loaded);
                for await (const chunk of readStream(stream)) {
                    loaded += chunk.byteLength;
                    progress(loaded);
                    controller.enqueue(chunk.buffer as ArrayBuffer);
                    if (abortController.signal.aborted) {
                        break;
                    }
                }
            } catch (e) {
                controller.error(e);
            } finally {
                controller.close();
            }
        },
        cancel: () => {
            abortController.abort();
        }
    });
}
