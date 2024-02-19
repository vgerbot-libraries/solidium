import { CacheProvider } from './CacheProvider';
import { Fetcher } from './Fetcher';
import { HttpInterceptor } from './HttpInterceptor';

export interface HttpConfiguration {
    baseUrl?: string | URL;
    interceptors?: HttpInterceptor[];
    search?: Record<string, string | number | boolean>;
    headers?: Record<string, string | string[]>;
    fetcher?: Fetcher;
    validateStatus?(status: number): boolean;
    cacheProvider?: CacheProvider;
}
