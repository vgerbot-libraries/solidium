import { EmptyEntity } from '../entity/EmptyEntity';
import { HttpConfiguration } from '../types/HttpConfiguration';
import { HttpEntity } from '../types/HttpEntity';
import { HttpHeaders } from '../types/HttpHeaders';
import { HttpMethod } from '../types/HttpMethod';
import { HttpRequest } from '../types/HttpRequest';
import { HttpRequestOptions } from '../types/HttpRequestOptions';

export class HttpRequestImpl implements HttpRequest {
    key: string | symbol;
    url: URL;
    body: HttpEntity;
    headers: HttpHeaders;
    method: HttpMethod;
    constructor(
        public readonly configuration: HttpConfiguration,
        private readonly requestOptions: HttpRequestOptions
    ) {
        const url = new URL(requestOptions.url, configuration.baseUrl);
        this.key = url.toString();
        this.url = url;
        this.body = requestOptions.body || new EmptyEntity();
        this.headers = requestOptions.headers
            ? configuration.headers.mergeAll(requestOptions.headers)
            : configuration.headers.clone();
        this.method = requestOptions.method || HttpMethod.GET;
    }
    clone(): HttpRequest {
        return new HttpRequestImpl(this.configuration, this.requestOptions);
    }
}
