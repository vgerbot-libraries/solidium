import type { Newable } from '@vgerbot/ioc';
import { StorageProvider } from './StorageProvider';
import { CacheStrategy } from './CacheStrategy';
import { Fetcher } from './Fetcher';
import { HttpHeaders } from './HttpHeaders';
import { HttpInterceptor } from './HttpInterceptor';
import { Cloneable } from './Cloneable';
import { HttpResponse } from './HttpResponse';
import { HttpRequestTriggerOptions } from './HttpRequestTriggerOptions';
import { HttpRequestTrigger } from './HttpRequestTrigger';

export interface HttpConfigurationOptions {
    baseUrl?: string | URL;
    interceptors?: Array<HttpInterceptor | HttpInterceptor['intercept']>;
    search?:
        | URLSearchParams
        | Record<
              string,
              string | number | boolean | Array<string | number | boolean>
          >;
    headers?: Record<string, string | string[]>;
    fetcher?: Fetcher;
    validateStatus?(response: HttpResponse): Promise<boolean>;
    trigger?:
        | HttpRequestTriggerOptions
        | Newable<HttpRequestTrigger>
        | HttpRequestTrigger;
    storageProvider?: Newable<StorageProvider>;
    cacheStrategy?: Newable<CacheStrategy>;
}

export interface HttpConfiguration extends Cloneable<HttpConfiguration> {
    baseUrl?: URL;
    interceptors: HttpInterceptor[];
    search: URLSearchParams | Record<string, string>;
    headers: HttpHeaders;
    fetcher: Fetcher;
    storageProvider: StorageProvider;
    cacheStrategy: CacheStrategy;
    trigger?: HttpRequestTrigger;
    validateStatus(response: HttpResponse): Promise<void>;
}
