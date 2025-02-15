import { ByteStream } from '../ByteStream';
import { NativeReadableStream } from './NativeReadableStream';

export class BlobByteStream extends NativeReadableStream implements ByteStream {
    constructor(blob: Blob) {
        super(blob.size, blob.stream());
    }
}
