import { HttpConfiguration } from '../types/HttpConfiguration';
import { HttpEntity } from '../types/HttpEntity';
import { HttpHeaders } from '../types/HttpHeaders';
import { HttpMethod } from '../types/HttpMethod';
import { HttpRequest } from '../types/HttpRequest';
import { HttpRequestOptions } from '../types/HttpRequestOptions';
export declare class HttpRequestImpl implements HttpRequest {
    readonly configuration: HttpConfiguration;
    private readonly requestOptions;
    url: URL;
    body: HttpEntity;
    headers: HttpHeaders;
    method: HttpMethod;
    disableCache: boolean;
    constructor(configuration: HttpConfiguration, requestOptions: HttpRequestOptions);
    clone(): HttpRequest;
    get key(): string;
}
