import { HttpEntity } from './HttpEntity';
import { HttpHeaders } from './HttpHeaders';
import { HttpMethod } from './HttpMethod';
import { HttpRequestTrigger } from './HttpRequestTrigger';
import { HttpRequestTriggerOptions } from './HttpRequestTriggerOptions';

export interface HttpRequestOptions {
    key?: string;
    url: string | URL;
    method?: HttpMethod;
    body?: HttpEntity;
    headers?: HttpHeaders;
    queries?: Record<string, string | string[]>;
    /**
     * Configuration for triggering automatic requests.
     */
    trigger?: HttpRequestTriggerOptions | HttpRequestTrigger;
    disableCache?: boolean;
}
