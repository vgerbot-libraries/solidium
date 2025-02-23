import { RequestMethod } from './RequestMethod';
import { ByteStream } from '../http/ByteStream';
import { HttpHeaders } from '../http/HttpHeaders';
import { HttpSource } from '../http/HttpSource';
export interface HttpResponseInit {
    status: number;
    method: RequestMethod;
}
export declare class HttpResponse implements HttpSource {
    private readonly source;
    readonly status: number;
    constructor(source: HttpSource, init: HttpResponseInit);
    headers(): Promise<HttpHeaders>;
    body(): Promise<ByteStream>;
    text(encoding?: string): Promise<string>;
    json<T>(): Promise<T>;
    textStream(encoding?: string): AsyncGenerator<string, void, unknown>;
    jsonStream<T>(encoding?: string): AsyncGenerator<Awaited<T>, void, unknown>;
}
