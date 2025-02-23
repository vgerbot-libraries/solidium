import { ProgressiveByteStream } from './ProgressiveByteStreams';
export declare class NativeReadableStream extends ProgressiveByteStream {
    private readonly contentLength;
    private readonly stream;
    constructor(contentLength: number, stream: ReadableStream);
    total(): Promise<number>;
    readAsBuffer(): Promise<ArrayBuffer>;
    readAsStream(): ReadableStream<ArrayBuffer>;
}
