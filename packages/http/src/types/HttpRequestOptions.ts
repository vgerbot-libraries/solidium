import { HttpEntity } from './HttpEntity';
import { HttpHeaders } from './HttpHeaders';
import { HttpMethod } from './HttpMethod';
import { HttpRequestTrigger } from './HttpRequestTrigger';

export interface HttpRequestOptions {
    url: string | URL;
    method?: HttpMethod;
    body?: HttpEntity;
    headers?: HttpHeaders;
    queries?: Record<string, string | string[]>;
    requestTrigger?: HttpRequestTrigger;
}
