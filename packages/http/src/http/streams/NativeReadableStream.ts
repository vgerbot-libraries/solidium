import { Progress } from '../../progress/Progress';
import { ProgressiveByteStream } from './ProgressiveByteStreams';

export class NativeReadableStream extends ProgressiveByteStream {
    private blobPromise: Promise<Blob> | null = null;

    constructor(
        private readonly contentLength: number,
        private readonly stream: ReadableStream
    ) {
        super();
    }

    total(): Promise<number> {
        return Promise.resolve(this.contentLength);
    }

    /**
     * Reads all chunks from the original stream and stores them as a Blob.
     * This is called only once, and subsequent calls will return the cached Blob.
     */
    private async readAsStoredBlob(): Promise<Blob> {
        // If we're already reading, return the promise
        if (this.blobPromise !== null) {
            return this.blobPromise;
        }

        const total = this.contentLength;
        let loaded = 0;

        this.blobPromise = new Promise<Blob>((resolve, reject) => {
            const chunks: ArrayBuffer[] = [];

            // Reset progress only once at the beginning
            this.updateProgress(new Progress(total, 0));

            // Get a reader from the original stream (this locks the stream)
            const reader = this.stream.getReader();

            (async () => {
                while (true) {
                    const { value: chunk, done } = await reader.read();
                    if (chunk) {
                        loaded += chunk.byteLength;
                        chunks.push(chunk);
                        this.updateProgress(new Progress(total, loaded));
                    }
                    if (done) {
                        const blob = new Blob(chunks);
                        resolve(blob);
                        break;
                    }
                }
            })().catch(reject);
        });

        return this.blobPromise;
    }

    async readAsBuffer(): Promise<ArrayBuffer> {
        const blob = await this.readAsStoredBlob();
        return await blob.arrayBuffer();
    }

    readAsStream(): ReadableStream<ArrayBuffer> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;

        return new ReadableStream({
            async start(controller) {
                try {
                    // Get the blob (either from cache or by reading the stream)
                    const blob = await that.readAsStoredBlob();

                    // Create a new stream from the blob
                    // This allows multiple calls to readAsStream() without locking issues
                    const blobStream = blob.stream();
                    const reader = blobStream.getReader();

                    // Process all chunks from the blob stream
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            controller.close();
                            break;
                        }
                        // Use a type assertion to handle the ArrayBuffer type
                        controller.enqueue(value.buffer as ArrayBuffer);
                    }
                } catch (error) {
                    console.error('Error in readAsStream:', error);
                    controller.error(error);
                }
            }
        });
    }

    async readAsBlob(
        contentType: string = 'application/octet-stream'
    ): Promise<Blob> {
        const blob = await this.readAsStoredBlob();
        // If the requested content type is different from the stored blob's type,
        // create a new blob with the requested type
        if (blob.type !== contentType) {
            return new Blob([blob], { type: contentType });
        }
        return blob;
    }
}
