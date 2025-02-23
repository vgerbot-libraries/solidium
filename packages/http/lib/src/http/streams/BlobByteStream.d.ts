import { ByteStream } from '../ByteStream';
import { NativeReadableStream } from './NativeReadableStream';
export declare class BlobByteStream extends NativeReadableStream implements ByteStream {
    constructor(blob: Blob);
}
