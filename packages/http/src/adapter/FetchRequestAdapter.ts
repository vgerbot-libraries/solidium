import { Defer } from '../common/Defer';
import { Events } from '../common/Events';
import { ByteStream } from '../http/ByteStream';
import { HttpHeaders } from '../http/HttpHeaders';
import { BlobByteStream } from '../http/streams/BlobByteStream';
import { NativeReadableStream } from '../http/streams/NativeReadableStream';
import { Progress } from '../progress/Progress';
import { ProgressHandler } from '../progress/ProgressHandler';
import { AdapterExecutionResult } from './AdapterExecutionResult';
import { AdapterOptions } from './AdapterOptions';
import { RequestAdapter } from './RequestAdapter';

export class FetchRequestAdapter implements RequestAdapter {
    private executeRequestIfNeed: () => void;
    private readonly events = new Events();
    private readonly headersDefer = new Defer<HttpHeaders>();
    private readonly bodyDefer = new Defer<ByteStream>();
    private status = 0;
    private readonly abortController = new AbortController();
    constructor(options: AdapterOptions) {
        this.executeRequestIfNeed = () => {
            this.executeRequestIfNeed = () => void 0;
            options.singal.addEventListener('abort', () => {
                this.abortController.abort();
            });
            if (options.singal.aborted) {
                this.abortController.abort();
            }
            fetch(options.url, {
                method: options.method,
                headers: options.headers.toNative(),
                body: options.body,
                signal: this.abortController.signal
            }).then(response => {
                this.status = response.status;
                this.headersDefer.resolve(new HttpHeaders(response.headers));
                if (!response.body) {
                    this.bodyDefer.resolve(new BlobByteStream(new Blob([])));
                } else {
                    const rawContentLength =
                        response.headers.get('Content-Length');
                    const contentLength = rawContentLength
                        ? parseInt(rawContentLength) || 0
                        : 0;
                    this.events.emit(
                        'download',
                        new Progress(contentLength, 0)
                    );
                    const stream = new NativeReadableStream(
                        contentLength,
                        response.body.pipeThrough(
                            new TransformStream({
                                transform(chunk, controller) {
                                    controller.enqueue(chunk.buffer);
                                }
                            })
                        )
                    );
                    stream.onProgress(progress => {
                        this.events.emit('download', progress);
                    });
                    this.bodyDefer.resolve(stream);
                }
            });
        };
    }
    abort(): void {
        this.abortController.abort();
    }
    onDownload(listener: ProgressHandler): () => void {
        return this.events.on('download', listener);
    }
    onUpload(listener: ProgressHandler): () => void {
        return () => void 0;
    }
    async execute(): Promise<AdapterExecutionResult> {
        this.executeRequestIfNeed();
        const that = this;
        const { headersDefer, bodyDefer } = this;
        return {
            get status() {
                return that.status;
            },
            headers() {
                return headersDefer.promise;
            },
            body() {
                return bodyDefer.promise;
            }
        };
    }
}
