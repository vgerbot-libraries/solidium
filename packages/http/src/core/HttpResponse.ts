import { RequestMethod } from './RequestMethod';
import { ByteStream } from '../http/ByteStream';
import { HttpHeaders } from '../http/HttpHeaders';
import { HttpSource } from '../http/HttpSource';
import { ProgressHandler } from '../progress/ProgressHandler';

export interface HttpResponseInit {
    method: RequestMethod;
}

export class HttpResponse implements HttpSource {
    constructor(
        private readonly source: HttpSource,
        public readonly init: HttpResponseInit
    ) {}
    status() {
        return this.source.status();
    }
    headers(): Promise<HttpHeaders> {
        return this.source.headers();
    }
    body(): Promise<ByteStream> {
        return this.source.body();
    }
    async text(encoding?: string) {
        const stream = await this.body();
        const buffer = await stream.readAsBuffer();
        const decoder = new TextDecoder(encoding);
        return decoder.decode(buffer);
    }
    async json<T>() {
        const text = await this.text();
        return JSON.parse(text) as T;
    }
    async *textStream(encoding: string = 'UTF-8') {
        const byteStream = await this.source.body();
        const stream = byteStream.readAsStream();
        const reader = stream.getReader();
        const decoder = new TextDecoder(encoding);
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            yield decoder.decode(value, {});
        }
    }
    async *jsonStream<T>(encoding: string = 'UTF-8') {
        const regex = /event:\s*?([^\s\n\r]+?)[\n\r\s]*data:\s*?(.*?)\s*$/i;
        for await (const chunk of this.textStream(encoding)) {
            const [, event, data] = regex.exec(chunk) ?? [];
            if (event !== 'message' || !data) {
                continue;
            }
            yield JSON.parse(data) as T;
        }
    }
    onUpload(listener: ProgressHandler): () => void {
        return this.source.onUpload(listener);
    }
    onDownload(listener: ProgressHandler): () => void {
        return this.source.onDownload(listener);
    }
}
