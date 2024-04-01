import { ContentDisposition } from '../types/ContentDisposition';
import { ContentType } from '../types/ContentType';
import { HttpHeaders } from '../types/HttpHeaders';
import { HttpRange } from '../types/HttpRange';
export declare class HttpHeadersImpl implements HttpHeaders {
    private readonly headers;
    static fromNativeHeaders(headers: Headers): HttpHeaders;
    static empty(): HttpHeadersImpl;
    constructor(headers?: Map<string, string[]>);
    set(name: string, value: string | string[]): HttpHeaders;
    append(name: string, value: string | string[]): HttpHeaders;
    remove(name: string): HttpHeaders;
    get(name: string): string[];
    getAll(): Map<string, string[]>;
    mergeAll(...other: HttpHeaders[]): HttpHeaders;
    getContentDisposition(): ContentDisposition | undefined;
    getContentType(): ContentType;
    getContentLength(): number;
    setAccept(contentType: ContentType): HttpHeaders;
    setBasicAuth(username: string, password: string): HttpHeaders;
    setBearAuth(token: string): HttpHeaders;
    setContentType(contentType: ContentType): HttpHeaders;
    setUserAgent(userAgent: string): HttpHeaders;
    setRange(range: HttpRange): HttpHeaders;
    toNativeHeaders(): Headers;
    clone(): HttpHeaders;
}
