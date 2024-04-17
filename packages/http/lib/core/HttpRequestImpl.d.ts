import { HttpEvent } from '../events/HttpEvent';
import { HttpEventMap, HttpEventType } from '../events/HttpEventMap';
import { Fetcher } from '../types/Fetcher';
import { HttpConfiguration } from '../types/HttpConfiguration';
import { HttpEntity } from '../types/HttpEntity';
import { HttpHeaders } from '../types/HttpHeaders';
import { HttpInterceptor } from '../types/HttpInterceptor';
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
    fetcher: Fetcher;
    private readonly listeners;
    constructor(configuration: HttpConfiguration, requestOptions: HttpRequestOptions);
    on<T extends HttpEventType>(type: T, listener: (event: HttpEventMap[T]) => void): () => void;
    dispatch(event: HttpEvent): void;
    clone(): HttpRequest;
    get key(): string;
    get interceptors(): HttpInterceptor[];
}
