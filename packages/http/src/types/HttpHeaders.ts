import { Charset } from './Charset';
import { Cloneable } from './Cloneable';
import { ContentDisposition } from './ContentDisposition';
import { ContentType } from './ContentType';
import { HttpRange } from './HttpRange';

export interface HttpHeaders extends Cloneable<HttpHeaders> {
    set(name: string, value: string | string[]): HttpHeaders;
    remove(name: string): HttpHeaders;
    get(name: string): string[];
    getAll(): Map<string, string[]>;

    getContentDisposition(): ContentDisposition | undefined;
    getContentType(): ContentType;
    getContentLength(): number;

    setAccept(contentType: ContentType): HttpHeaders;
    setBasicAuth(credentials: string): HttpHeaders;
    setBasicAuth(
        username: string,
        password: string,
        charset?: Charset
    ): HttpHeaders;
    setBearAuth(token: string): HttpHeaders;
    setContentType(contentType: ContentType): HttpHeaders;
    setUserAgent(userAgent: string): HttpHeaders;
    setRange(range: HttpRange): HttpHeaders;
}
