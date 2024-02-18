import { HttpEntity } from './HttpEntity';
import { HttpHeaders } from './HttpHeaders';
import { HttpMethod } from './HttpMethod';

export interface HttpRequestOptions {
    url: string | URL;
    method?: HttpMethod;
    body?: HttpEntity;
    headers?: HttpHeaders;
    queries?: Record<string, string | string[]>;
}
