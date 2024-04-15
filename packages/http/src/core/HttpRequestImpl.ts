import { createEntity } from '../common/createEntity';
import { resolveURL } from '../common/resolveURL';
import { Fetcher } from '../types/Fetcher';
import { HttpConfiguration } from '../types/HttpConfiguration';
import { HttpEntity } from '../types/HttpEntity';
import { HttpHeaders } from '../types/HttpHeaders';
import { HttpInterceptor } from '../types/HttpInterceptor';
import { HttpMethod } from '../types/HttpMethod';
import { HttpRequest } from '../types/HttpRequest';
import { HttpRequestOptions } from '../types/HttpRequestOptions';

export class HttpRequestImpl implements HttpRequest {
    url: URL;
    body: HttpEntity;
    headers: HttpHeaders;
    method: HttpMethod;
    disableCache: boolean;
    fetcher: Fetcher;
    constructor(
        public readonly configuration: HttpConfiguration,
        private readonly requestOptions: HttpRequestOptions
    ) {
        const url = resolveURL(configuration.baseUrl, requestOptions.url);
        const searchParams = {
            ...configuration.search,
            ...(requestOptions.search || {})
        };
        for (const key in searchParams) {
            const value = searchParams[key];
            if (Array.isArray(value)) {
                value.forEach(it => url.searchParams.append(key, it));
            } else {
                url.searchParams.set(key, value);
            }
        }
        this.url = url;
        const body = createEntity(requestOptions.body);
        this.body = body;
        this.headers = requestOptions.headers
            ? configuration.headers.mergeAll(requestOptions.headers)
            : configuration.headers.clone();
        this.method = requestOptions.method || HttpMethod.GET;
        this.disableCache = requestOptions.disableCache || false;
        this.fetcher = requestOptions.fetcher || configuration.fetcher;
    }
    clone(): HttpRequest {
        return new HttpRequestImpl(this.configuration, this.requestOptions);
    }
    get key(): string {
        if (this.requestOptions['key']) {
            return this.requestOptions.key;
        }
        return this.url.toString();
    }
    get interceptors(): HttpInterceptor[] {
        return this.configuration.interceptors.concat(
            this.requestOptions.interceptors || []
        );
    }
}
