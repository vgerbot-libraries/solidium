import { ApplicationContext, Factory, Inject, PostInject } from '@vgerbot/ioc';
import { HTTP_CONFIGURER, HTTP_CONFIGURATION } from './constants';

import { HttpRequestOptions } from '../types/HttpRequestOptions';
import { Resource } from '../types/Resource';
import { HttpConfigurer } from '../types/HttpConfigurer';
import { HttpInterceptorRegistryImpl } from './HttpInterceptorRegistryImpl';
import {
    HttpConfiguration,
    HttpConfigurationOptions
} from '../types/HttpConfiguration';
import { internalFetcher } from './internanFetcher';
import { keep } from '../common/keep';
import { HttpHeadersImpl } from './HttpHeadersImpl';
import { HttpMethod } from '../types/HttpMethod';
import { DataResource } from '../resource/DataResource';
import { MemoryCacheProvider } from '../cache/provider/MemoryCacheProvider';
import { Mutation } from '../resource/Mutation';
import { NoCacheStrategy } from '../cache/strategy/NoCacheStrategy';
import { ImmediateTrigger } from '../trigger';

export class HttpClient {
    static configure(configuration: HttpConfigurationOptions) {
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
    private configurationOptions: HttpConfigurationOptions = {};
    @Inject(HTTP_CONFIGURER)
    private configurers?: HttpConfigurer[];
    @Inject()
    private appCtx!: ApplicationContext;
    private readonly interceptorRegistry = new HttpInterceptorRegistryImpl();

    private readonly configuration: HttpConfiguration = {
        baseUrl: new URL(globalThis.location.origin),
        interceptors: [],
        headers: HttpHeadersImpl.empty(),
        search: {},
        fetcher: internalFetcher,
        cacheProvider: new MemoryCacheProvider(),
        cacheStrategy: new NoCacheStrategy(),
        trigger: ImmediateTrigger
    };

    @PostInject()
    afterInjected() {
        const { baseUrl, headers, interceptors, search, fetcher } =
            this.configurationOptions;
        if (baseUrl) {
            this.configuration.baseUrl = new URL(baseUrl);
        }
        if (headers) {
            for (const key in headers) {
                this.configuration.headers.set(key, headers[key]);
            }
        }
        if (interceptors) {
            interceptors.forEach(interceptor => {
                this.interceptorRegistry.addInterceptor(interceptor);
            });
        }
        if (search) {
            for (const key in search) {
                this.configuration.search[key] = search[key] + '';
            }
        }
        this.configuration.fetcher = fetcher || this.configuration.fetcher;

        this.configurers?.forEach(configurer => {
            configurer.configHeaders &&
                configurer.configHeaders(this.configuration.headers);
            configurer.addInterceptors &&
                configurer.addInterceptors(this.interceptorRegistry);
        });
        this.configuration.interceptors.push(
            ...(
                this.interceptorRegistry as HttpInterceptorRegistryImpl
            ).getInterceptors()
        );
    }

    createResource(options: HttpRequestOptions): Resource {
        switch (options.method || HttpMethod.GET) {
            case HttpMethod.GET:
            case HttpMethod.HEAD:
                const resource = this.appCtx.getInstance(DataResource);
                resource.init(this.configuration, options);
                return resource;
            case HttpMethod.PUT:
            case HttpMethod.DELETE:
            case HttpMethod.PATCH:
            case HttpMethod.POST:
                return new Mutation(this.configuration, options);
            default:
                throw new Error(
                    'Unsupported or invalid method: ' + options.method
                );
        }
    }
}
