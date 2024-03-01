import { ContentDisposition } from '../types/ContentDisposition';
import { ContentType } from '../types/ContentType';
import { HttpHeaders } from '../types/HttpHeaders';
import { HttpRange } from '../types/HttpRange';

export class HttpHeadersImpl implements HttpHeaders {
    public static fromNativeHeaders(headers: Headers): HttpHeaders {
        const newHeaders: HttpHeaders = new HttpHeadersImpl();
        headers.forEach((value: string, key: string) => {
            newHeaders.set(key, value);
        });
        return newHeaders;
    }
    public static empty() {
        return new HttpHeadersImpl();
    }
    constructor(private readonly headers = new Map<string, string[]>()) {}
    set(name: string, value: string | string[]): HttpHeaders {
        name = name.toLowerCase();
        if (Array.isArray(value)) {
            this.headers.set(name, value);
        } else {
            this.headers.set(name, [value]);
        }
        return this;
    }
    append(name: string, value: string | string[]): HttpHeaders {
        name = name.toLowerCase();
        const values = this.get(name);
        this.headers.set(name, values.concat(value));
        return this;
    }
    remove(name: string): HttpHeaders {
        this.headers.delete(name);
        return this;
    }
    get(name: string): string[] {
        return this.headers.get(name.toLowerCase()) || [];
    }
    getAll(): Map<string, string[]> {
        return this.headers;
    }
    mergeAll(...other: HttpHeaders[]): HttpHeaders {
        other.forEach(other => {
            other.getAll().forEach((value, key) => {
                const values = this.get(key);
                value.forEach(valueItem => {
                    if (!values.includes(valueItem)) {
                        values.push(valueItem);
                    }
                });
                this.set(key, values);
            });
        });
        return this;
    }
    getContentDisposition(): ContentDisposition | undefined {
        const contentDisposition = this.get('Content-Disposition')[0];
        if (!contentDisposition) {
            return ContentDisposition.empty();
        }
        return ContentDisposition.parse(contentDisposition);
    }
    getContentType(): ContentType {
        const contentType = this.get('Content-Type')[0];
        if (!contentType) {
            return ContentType.none();
        }
        const [media, charset] = contentType.split(';');
        return ContentType.from(media, charset);
    }
    getContentLength(): number {
        const contentLength = this.get('Content-Length')[0];
        const len = parseInt(contentLength);
        return isFinite(len) ? len : 0;
    }
    setAccept(contentType: ContentType): HttpHeaders {
        this.set('Accept', contentType.toString());
        return this;
    }
    setBasicAuth(username: string, password: string): HttpHeaders {
        if (
            typeof username !== 'string' ||
            (password && typeof password !== 'string')
        ) {
            throw new Error('Username and password must be strings');
        }
        const credentials = btoa(`${username}:${password}`);
        this.set('Authorization', `Basic ${credentials}`);
        return this;
    }
    setBearAuth(token: string): HttpHeaders {
        this.set('Authorization', `Bearer ${token}`);
        return this;
    }
    setContentType(contentType: ContentType): HttpHeaders {
        this.set('Content-Type', contentType.toString());
        return this;
    }
    setUserAgent(userAgent: string): HttpHeaders {
        this.set('User-Agent', userAgent);
        return this;
    }
    setRange(range: HttpRange): HttpHeaders {
        this.set('Range', range.toString());
        return this;
    }
    toNativeHeaders(): Headers {
        const nativeHeaders = new Headers({});
        this.headers.forEach((value, key) => {
            value.forEach(valueItem => {
                nativeHeaders.append(key, valueItem);
            });
        });
        return nativeHeaders;
    }
    clone(): HttpHeaders {
        const headers = new Map<string, string[]>();
        this.headers.forEach((value, key) => {
            headers.set(key, value.slice(0));
        });
        return new HttpHeadersImpl(headers);
    }
}
