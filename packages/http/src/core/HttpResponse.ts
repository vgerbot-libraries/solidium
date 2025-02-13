import { RequestMethod } from './RequestMethod';
import { ByteStream } from '../http/ByteStream';
import { HttpHeaders } from '../http/HttpHeaders';
import { HttpSource } from '../http/HttpSource';

export interface HttpResponseInit {
    status: number;
    context: RequestMethod;
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
}
