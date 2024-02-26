import type { Newable } from '@vgerbot/ioc';
import { CacheProvider } from './CacheProvider';
import { CacheStrategy } from './CacheStrategy';
import { Fetcher } from './Fetcher';
import { HttpHeaders } from './HttpHeaders';
import { HttpInterceptor } from './HttpInterceptor';
import { HttpRequestTrigger } from './HttpRequestTrigger';

export interface HttpConfigurationOptions {
    baseUrl?: string | URL;
    interceptors?: HttpInterceptor[];
    search?: Record<string, string | number | boolean>;
    headers?: Record<string, string | string[]>;
    fetcher?: Fetcher;
    validateStatus?(status: number): boolean;
    cacheProvider?: CacheProvider;
}

export interface HttpConfiguration {
    baseUrl: URL;
    interceptors: HttpInterceptor[];
    search: Record<string, string>;
    headers: HttpHeaders;
    fetcher: Fetcher;
    cacheProvider: CacheProvider;
    cacheStrategy: CacheStrategy;
    trigger: Newable<HttpRequestTrigger>;
}
