import { Charset } from './Charset';
import { Cloneable } from './Cloneable';
import { ContentDisposition } from './ContentDisposition';
import { HttpMethod } from './HttpMethod';
import { HttpRange } from './HttpRange';
import { MediaType } from './MediaType';

export interface HttpHeaders extends Cloneable<HttpHeaders> {
    set(name: string, value: string | string[]): HttpHeaders;
    remove(name: string): HttpHeaders;
    get(name: string): string[];
    getAll(): Map<string, string[]>;

    setAccept(acceptableMediaTypes: MediaType[]): HttpHeaders;
    setAcceptCharset(acceptableCharsets: Set<Charset>): HttpHeaders;
    setAcceptLanguage(languages: string[]): HttpHeaders;
    setAcceptLanguageAsLocales(locales: string[]): HttpHeaders;
    setAcceptPatch(mediaTypes: MediaType[]): HttpHeaders;
    setAccessControlAllowCredentials(allowCredentials: boolean): HttpHeaders;
    setAccessControlAllowHeaders(allowedHeaders: string[]): HttpHeaders;
    setAccessControlAllowMethods(allowedMethods: Set<HttpMethod>): HttpHeaders;
    setAccessControlAllowOrigin(allowedOrigin: string): HttpHeaders;
    setAccessControlExposeHeaders(exposedHeaders: string[]): HttpHeaders;
    setAccessControlMaxAge(maxAge: number): HttpHeaders;
    setAccessControlRequestHeaders(requestHeaders: string[]): HttpHeaders;
    setAccessControlRequestMethod(requestMethod: HttpMethod): HttpHeaders;
    setAll(values: Map<string, string>): HttpHeaders;
    setAllow(allowedMethods: Set<HttpMethod>): HttpHeaders;
    setBasicAuth(encodedCredentials: string): HttpHeaders;
    setBasicAuth(
        username: string,
        password: string,
        charset?: Charset
    ): HttpHeaders;
    setBearerAuth(token: string): HttpHeaders;
    setCacheControl(cacheControl: string): HttpHeaders;
    setConnection(connection: string | string[]): HttpHeaders;
    setContentDisposition(contentDisposition: ContentDisposition): HttpHeaders;
    setContentDispositionFormData(name: string, filename: string): HttpHeaders;
    setContentLanguage(locale: string): HttpHeaders;
    setContentLength(contentLength: number): HttpHeaders;
    setContentType(mediaType: MediaType): HttpHeaders;
    setDate(date: number | string | Date, headerName?: string): HttpHeaders;
    setETag(etag: string): HttpHeaders;
    setExpires(expires: number | string): HttpHeaders;
    setHost(host: string): HttpHeaders;
    setIfMatch(ifMatch: string | string[]): HttpHeaders;
    setIfModifiedSince(ifModifiedSince: number | string): HttpHeaders;
    setIfNoneMatch(ifNoneMatch: string | string[]): HttpHeaders;
    setIfUnmodifiedSince(ifUnmodifiedSince: number | string): HttpHeaders;
    setInstant(headerName: string, date: string | Date): HttpHeaders;
    setLastModified(lastModified: number | string): HttpHeaders;
    setLocation(location: URL | string): HttpHeaders;
    setOrigin(origin: string): HttpHeaders;
    setPragma(pragma: string): HttpHeaders;
    setRange(ranges: HttpRange[]): HttpHeaders;
    setUpgrade(upgrade: string): HttpHeaders;
    setVary(requestHeaders: string[]): HttpHeaders;
    setZonedDateTime(headerName: string, date: string | Date): HttpHeaders;
}
