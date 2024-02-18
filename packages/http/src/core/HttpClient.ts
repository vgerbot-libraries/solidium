import { Factory, Inject, PostInject } from '@vgerbot/ioc';
import { HTTP_CONFIGURER, HTTP_CONFIGURATION } from './constants';

import { HttpRequestOptions } from '../types/HttpRequestOptions';
import { Resource } from './Resource';
import { HttpConfigurer } from '../types/HttpConfigurer';
import { HttpInterceptorRegistryImpl } from './HttpInterceptorRegistryImpl';
import { HttpHeaders } from '../types/HttpHeaders';
import { Fetcher } from '../types/Fetcher';
import { HttpConfiguration } from '../types/HttpConfiguration';
import { internalFetcher } from './internanFetcher';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function keep(..._: unknown[]) {
    // PASS
}
export class HttpClient {
    static configure(configuration: HttpConfiguration) {
        class HttpConfigurationFactory {
            @Factory(HTTP_CONFIGURATION)
            getConfiguration() {
                return configuration;
            }
        }
        keep(HttpConfigurationFactory);

        return HttpClient;
    }
    @Inject(HTTP_CONFIGURATION)
    private configuration: HttpConfiguration = {
        baseUrl: globalThis.location ? globalThis.location.origin : undefined
    };
    @Inject(HTTP_CONFIGURER)
    private configurers!: HttpConfigurer[];
    private interceptorRegistry = new HttpInterceptorRegistryImpl();
    private baseUrl?: URL = globalThis.location
        ? new URL(globalThis.location.origin)
        : undefined;
    private headers!: HttpHeaders; // TODO:
    private search: Record<string, string> = {};
    private fetcher: Fetcher = internalFetcher;

    @PostInject()
    afterInjected() {
        const { baseUrl, headers, interceptors, search, fetcher } =
            this.configuration;
        this.baseUrl = baseUrl ? new URL(baseUrl) : this.baseUrl;
        if (headers) {
            for (const key in headers) {
                this.headers.set(key, headers[key]);
            }
        }
        if (interceptors) {
            interceptors.forEach(interceptor => {
                this.interceptorRegistry.addInterceptor(interceptor);
            });
        }
        if (search) {
            for (const key in search) {
                this.search[key] = search[key] + '';
            }
        }
        this.fetcher = fetcher || this.fetcher;

        this.configurers.forEach(configurer => {
            configurer.configHeaders && configurer.configHeaders(this.headers);
            configurer.addInterceptors &&
                configurer.addInterceptors(this.interceptorRegistry);
        });
    }

    createResource(options: HttpRequestOptions): Resource {
        // TODO:
        throw new Error('');
    }
}
