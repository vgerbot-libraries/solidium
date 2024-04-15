import { Cloneable } from './Cloneable';
import { Fetcher } from './Fetcher';
import { HttpConfiguration } from './HttpConfiguration';
import { HttpEntity } from './HttpEntity';
import { HttpHeaders } from './HttpHeaders';
import { HttpInterceptor } from './HttpInterceptor';
import { HttpMethod } from './HttpMethod';

export interface HttpRequest extends Cloneable<HttpRequest> {
    key: string; // default to url.toString()
    url: URL;
    body: HttpEntity;
    headers: HttpHeaders;
    method: HttpMethod;
    configuration: HttpConfiguration;
    disableCache: boolean;
    fetcher: Fetcher;
    interceptors: HttpInterceptor[];
}
