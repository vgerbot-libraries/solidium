import { Fetcher } from './Fetcher';
import { HttpEntity } from './HttpEntity';
import { HttpHeaders } from './HttpHeaders';
import { HttpInterceptor } from './HttpInterceptor';
import { HttpMethod } from './HttpMethod';
import { HttpRequestTrigger } from './HttpRequestTrigger';
import { HttpRequestTriggerOptions } from './HttpRequestTriggerOptions';
import { JSONType } from './JSONType';
import { ParameterEncoder } from './ParameterEncoder';

export interface HttpRequestOptions {
    key?: string;
    path: string;
    params?: Record<string, unknown>;
    parameterEncoder?: ParameterEncoder;
    method?: HttpMethod;
    body?: HttpEntity | BodyInit | JSONType;
    headers?: HttpHeaders;
    search?: Record<string, string | string[]>;
    /**
     * Configuration for triggering automatic requests.
     */
    trigger?: HttpRequestTriggerOptions | HttpRequestTrigger;
    disableCache?: boolean;
    interceptors?: HttpInterceptor[];
    fetcher?: Fetcher;
}
