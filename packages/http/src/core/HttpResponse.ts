import { RequestMethod } from './RequestMethod';
import { ByteStream } from '../http/ByteStream';
import { HttpHeaders } from '../http/HttpHeaders';
import { HttpSource } from '../http/HttpSource';

export interface HttpResponseInit {
    status: number;
    method: RequestMethod;
}

export class HttpResponse implements HttpSource {
    public readonly status: number;
    constructor(
        private readonly source: HttpSource,
        init: HttpResponseInit
    ) {
        this.status = init.status;
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
}
