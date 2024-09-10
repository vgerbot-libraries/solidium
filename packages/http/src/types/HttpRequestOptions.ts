import { Fetcher } from './Fetcher';
import { HttpEntity } from './HttpEntity';
import { HttpHeaders } from './HttpHeaders';
import { HttpInterceptor } from './HttpInterceptor';
import { HttpMethod } from './HttpMethod';
import { HttpRequestTrigger } from './HttpRequestTrigger';
import { HttpRequestTriggerOptions } from './HttpRequestTriggerOptions';
import { JSONType } from './JSONType';
import { ParameterEncoder } from './ParameterEncoder';
import { SearchParams } from './SearchParams';

export type HttpRequestCacheOption =
    | boolean
    | {
          mode: 'memory' | 'idb' | 'localstorage' | 'sessionstorage';
          /**
           * The unit is milliseconds
           * When set to `Infinity`, it means that the data will never expire.
           * When set to 0 or a negative number, it means not to cache.
           */
          expire: number;
      };

export interface HttpRequestOptions {
    key?: string;
    path: string;
    params?: Record<string, unknown>;
    parameterEncoder?: ParameterEncoder;
    method?: HttpMethod;
    body?: HttpEntity | BodyInit | JSONType;
    headers?: HttpHeaders;
    search?: SearchParams;
    /**
     * Configuration for triggering automatic requests.
     */
    trigger?: HttpRequestTriggerOptions | HttpRequestTrigger;
    cache?: HttpRequestCacheOption;
    interceptors?: HttpInterceptor[];
    fetcher?: Fetcher;
}
