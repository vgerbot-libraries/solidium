import { Defer } from '../common/Defer';
import { Events } from '../common/Events';
import { AdapterOptions } from './AdapterOptions';
import { RequestAdapter } from './RequestAdapter';
import { ByteStream } from '../http/ByteStream';
import { HttpHeaders } from '../http/HttpHeaders';
import { BlobByteStream } from '../http/streams/BlobByteStream';
import { Progress } from '../progress/Progress';
import { ProgressHandler } from '../progress/ProgressHandler';
import { AdapterExecutionResult } from './AdapterExecutionResult';

export class XMLHttpRequestAdapter implements RequestAdapter {
    private readonly xhr: XMLHttpRequest;
    private executeRequestIfNeed: () => void;
    private readonly events = new Events();
    private readonly headersDefer = new Defer<HttpHeaders>();
    private bodyDefer = new Defer<ByteStream>();
    private isAborted = false;

    constructor(options: AdapterOptions) {
        const xhr = new XMLHttpRequest();
        xhr.open(options.method, options.url);
        xhr.responseType = 'blob';
        options.headers.forEach((name, values) => {
            xhr.setRequestHeader(name, values.join(','));
        });
        xhr.addEventListener('progress', event => {
            if (!event.lengthComputable) {
                return;
            }
            this.events.emit(
                'download',
                new Progress(event.total, event.loaded)
            );
        });
        xhr.upload.addEventListener('progress', event => {
            if (!event.lengthComputable) {
                return;
            }
            this.events.emit('upload', new Progress(event.total, event.loaded));
        });
        this.executeRequestIfNeed = () => {
            this.executeRequestIfNeed = () => void 0;
            if (this.isAborted) {
                return;
            }
            if (options.body) {
                xhr.send(options.body);
            }
        };
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
                const headersStr = xhr.getAllResponseHeaders();
                const headers = new HttpHeaders();
                headersStr
                    .trim()
                    .split(/[\r\n]+/)
                    .forEach(line => {
                        const parts = line.split(': ');
                        const header = parts.shift();
                        const value = parts.join(': ');
                        if (!header) {
                            return;
                        }
                        headers.append(header, value);
                    });
                this.headersDefer.resolve(headers);
            } else if (xhr.readyState === XMLHttpRequest.DONE) {
                this.bodyDefer.resolve(new BlobByteStream(xhr.response));
            }
        });
        this.xhr = xhr;
        if (options.singal.aborted) {
            this.isAborted = true;
            xhr.abort();
        } else {
            options.singal.addEventListener('abort', () => {
                this.isAborted = true;
                xhr.abort();
            });
        }
    }
    abort(): void {
        this.isAborted = true;
        this.xhr.abort();
    }
    onDownload(listener: ProgressHandler): () => void {
        return this.events.on('download', listener);
    }
    onUpload(listener: ProgressHandler): () => void {
        return this.events.on('upload', listener);
    }
    async execute(): Promise<AdapterExecutionResult> {
        this.executeRequestIfNeed();
        const { headersDefer, bodyDefer } = this;
        return {
            status: this.xhr.status,
            headers() {
                return headersDefer.promise;
            },
            body() {
                return bodyDefer.promise;
            }
        };
    }
}
