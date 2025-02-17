import { ProgressHandler } from '../progress/ProgressHandler';

export interface ByteStream {
    total(): Promise<number>;
    onProgress(handler: ProgressHandler): () => void;
    readAsBuffer(): Promise<ArrayBuffer>;
    readAsStream(): ReadableStream<ArrayBuffer>;
}
