import { Progress } from '../../progress/Progress';
import { ByteStream } from '../ByteStream';
import { ProgressiveByteStream } from './ProgressiveByteStreams';

export class BlobByteStream
    extends ProgressiveByteStream
    implements ByteStream
{
    constructor(private readonly blob: Blob) {
        super();
    }
    total(): Promise<number> {
        return Promise.resolve(this.blob.size);
    }
    async readAsBuffer(): Promise<ArrayBuffer> {
        const total = this.blob.size;
        const reader = this.blob.stream().getReader();
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
