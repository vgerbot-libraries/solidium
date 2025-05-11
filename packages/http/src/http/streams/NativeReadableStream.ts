import { readStream } from '../../common/readStream';
import { Progress } from '../../progress/Progress';
import { ProgressiveByteStream } from './ProgressiveByteStreams';

export class NativeReadableStream extends ProgressiveByteStream {
    private blobPromise: Promise<Blob> | null = null;

    constructor(
        private readonly contentLength: number,
        protected readonly stream: ReadableStream
    ) {
        super();
    }

    total(): Promise<number> {
        return Promise.resolve(this.contentLength);
    }
    private async readAsStoredBlob(): Promise<Blob> {
        if (this.blobPromise !== null) {
            return this.blobPromise;
        }

        const total = this.contentLength;
        let loaded = 0;

        this.blobPromise = new Promise<Blob>((resolve, reject) => {
            const chunks: ArrayBuffer[] = [];

            this.updateProgress(new Progress(total, 0));
            (async () => {
                for await (const chunk of readStream(this.stream)) {
                    loaded += chunk.byteLength;
                    chunks.push(chunk);
                    this.updateProgress(new Progress(total, loaded));
                }
                const blob = new Blob(chunks);
                resolve(blob);
            })().catch(reject);
        });

        return this.blobPromise;
    }

    async readAsBuffer(): Promise<ArrayBuffer> {
        const blob = await this.readAsStoredBlob();
        return await blob.arrayBuffer();
    }

    readAsStream(): ReadableStream<ArrayBuffer> {
        return new ReadableStream({
            start: async controller => {
                try {
                    const blob = await this.readAsStoredBlob();
                    const blobStream =
                        blob.stream() as ReadableStream<Uint8Array>;

                    for await (const chunk of readStream(blobStream)) {
                        controller.enqueue(chunk.buffer as ArrayBuffer);
                    }
                    controller.close();
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
