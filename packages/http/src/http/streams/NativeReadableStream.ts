import { Progress } from '../../progress/Progress';
import { ProgressiveByteStream } from './ProgressiveByteStreams';

export class NativeReadableStream extends ProgressiveByteStream {
    constructor(
        private readonly contentLength: number,
        private readonly stream: ReadableStream
    ) {
        super();
    }
    total(): Promise<number> {
        return Promise.resolve(this.contentLength);
    }
    async readAsBuffer(): Promise<ArrayBuffer> {
        const total = this.contentLength;
        const reader = this.stream.getReader();
        const chunks: Uint8Array[] = [];
        let loaded = 0;
        this.updateProgress(new Progress(total, 0));
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            loaded += value.byteLength;
            chunks.push(value);
            const progress = new Progress(total, loaded, value);
            this.updateProgress(progress);
        }
        const realTotal = chunks.reduce((sum, it) => sum + it.byteLength, 0);
        const result = new Uint8Array(realTotal);

        chunks.reduce((offset, chunk) => {
            result.set(chunk, offset);
            return offset + chunk.byteLength;
        }, 0);
        return result.buffer;
    }
}
