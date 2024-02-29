import { Cloneable } from './Cloneable';
import { ContentDisposition } from './ContentDisposition';
import { ContentType } from './ContentType';
import { HttpRange } from './HttpRange';

export interface HttpHeaders extends Cloneable<HttpHeaders> {
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
}
