import { Progress } from '../../progress/Progress';
import { ProgressHandler } from '../../progress/ProgressHandler';
import { ByteStream } from '../ByteStream';
export declare abstract class ProgressiveByteStream implements ByteStream {
    private readonly events;
    abstract total(): Promise<number>;
    onProgress(handler: ProgressHandler): () => void;
    protected updateProgress(progress: Progress): void;
    abstract readAsBuffer(): Promise<ArrayBuffer>;
    abstract readAsStream(): ReadableStream<ArrayBuffer>;
}
