import type { Newable } from '@vgerbot/ioc';
import { CacheProvider } from './CacheProvider';
import { CacheStrategy } from './CacheStrategy';
import { Fetcher } from './Fetcher';
import { HttpHeaders } from './HttpHeaders';
import { HttpInterceptor } from './HttpInterceptor';
import { HttpRequestTrigger } from './HttpRequestTrigger';
import { Cloneable } from './Cloneable';

export interface HttpConfigurationOptions {
    baseUrl?: string | URL;
    interceptors?: HttpInterceptor[];
    search?: Record<string, string | number | boolean>;
    headers?: Record<string, string | string[]>;
    fetcher?: Fetcher;
    validateStatus?(status: number): boolean;
    cacheProvider?: Newable<CacheProvider>;
    cacheStrategy?: Newable<CacheStrategy>;
    trigger?: Newable<HttpRequestTrigger>;
}

export interface HttpConfiguration extends Cloneable<HttpConfiguration> {
    baseUrl: URL;
    interceptors: HttpInterceptor[];
    search: Record<string, string>;
    headers: HttpHeaders;
    fetcher: Fetcher;
    cacheProvider: CacheProvider;
    cacheStrategy: CacheStrategy;
    trigger: HttpRequestTrigger;
}
