import { HttpEvent } from '../events/HttpEvent';
import { HttpEventMap, HttpEventType } from '../events/HttpEventMap';
import { Cloneable } from './Cloneable';
import { Fetcher } from './Fetcher';
import { HttpConfiguration } from './HttpConfiguration';
import { HttpEntity } from './HttpEntity';
import { HttpHeaders } from './HttpHeaders';
import { HttpInterceptor } from './HttpInterceptor';
import { HttpMethod } from './HttpMethod';
import { HttpRequestCacheOption } from './HttpRequestOptions';
export interface HttpRequest extends Cloneable<HttpRequest> {
    key: string;
    url: URL;
    body: HttpEntity;
    headers: HttpHeaders;
    method: HttpMethod;
    configuration: HttpConfiguration;
    cacheOption: HttpRequestCacheOption;
    fetcher: Fetcher;
    interceptors: HttpInterceptor[];
    dispatch(event: HttpEvent): void;
    on<T extends HttpEventType>(type: T, listener: (event: HttpEventMap[T]) => void): () => void;
}
