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
        const reader = this.readAsStream().getReader();
        const chunks: Uint8Array[] = [];
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            chunks.push(new Uint8Array(value));
        }
        const realTotal = chunks.reduce((sum, it) => sum + it.byteLength, 0);
        const result = new Uint8Array(realTotal);

        {
            let offset = 0;
            for (const chunk of chunks) {
                result.set(chunk, offset);
                offset += chunk.byteLength;
            }
        }
        return result.buffer;
    }
    readAsStream(): ReadableStream<ArrayBuffer> {
        const stream = this.stream;
        const total = this.contentLength;
        let loaded = 0;
        const that = this;
        return new ReadableStream({
            start(controller) {
                that.updateProgress(new Progress(total, 0));
                const reader = stream.getReader();
                reader.read().then(function process({ done, value }) {
                    if (done) {
                        controller.close();
                        return;
                    }
                    controller.enqueue(value);
                    loaded += value.byteLength;
                    that.updateProgress(new Progress(total, loaded));
                    reader.read().then(process);
                });
            }
        });
    }
}
