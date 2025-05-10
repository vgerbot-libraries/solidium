import { Defer } from '../common/Defer';
import { Events } from '../common/Events';
import { ByteStream } from '../http/ByteStream';
import { HttpHeaders } from '../http/HttpHeaders';
import { HttpSource } from '../http/HttpSource';
import { BlobByteStream } from '../http/streams/BlobByteStream';
import { NativeReadableStream } from '../http/streams/NativeReadableStream';
import { Progress } from '../progress/Progress';
import { ProgressHandler } from '../progress/ProgressHandler';
import { AdapterOptions } from './AdapterOptions';
import { RequestAdapter } from './RequestAdapter';

export class FetchRequestAdapter implements RequestAdapter {
    private executeRequestIfNeed: () => void;
    private readonly events = new Events();
    private readonly headersDefer = new Defer<HttpHeaders>();
    private readonly bodyDefer = new Defer<ByteStream>();
    private readonly statusDefer = new Defer<number>();
    private readonly abortController = new AbortController();
    constructor(options: AdapterOptions) {
        this.executeRequestIfNeed = () => {
            this.executeRequestIfNeed = () => void 0;
            options.signal.addEventListener('abort', () => {
                this.abortController.abort();
            });
            if (options.signal.aborted) {
                this.abortController.abort();
            }
            fetch(options.url, {
                method: options.method,
                headers: options.headers.toNative(),
                body: options.payload,
                signal: this.abortController.signal
            }).then(response => {
                this.statusDefer.resolve(response.status);
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
    async execute(): Promise<HttpSource> {
        this.executeRequestIfNeed();
        const { headersDefer, bodyDefer, statusDefer, events } = this;
        return {
            status() {
                return statusDefer.promise;
            },
            headers() {
                return headersDefer.promise;
            },
            body() {
                return bodyDefer.promise;
            },
            onDownload(listener: ProgressHandler): () => void {
                return events.on('download', listener);
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onUpload(_listener: ProgressHandler): () => void {
                return () => void 0;
            },
            onBodyComplete(listener) {
                let isListenerCancelled = false;
                bodyDefer.promise.then(body => {
                    if (isListenerCancelled) {
                        return;
                    }
                    listener(body);
                });
                return () => {
                    isListenerCancelled = true;
                };
            }
        };
    }
}
