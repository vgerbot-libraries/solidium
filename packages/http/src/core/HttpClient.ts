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
import { WorkerResource } from '../resource/WorkerResource';
import { MemoryStorageProvider } from '../cache/provider/MemoryStorageProvider';
import { NoCacheStrategy } from '../cache/strategy/NoCacheStrategy';
import { ImmediateTrigger } from '../trigger';
import { StorageProvider } from '../types/StorageProvider';
import { CacheStrategy } from '../types/CacheStrategy';
import { HttpRequestTrigger } from '../types/HttpRequestTrigger';
import { internalValidateStatus } from './internalValidateStatus';

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

    private configuration!: HttpConfiguration;

    @PostInject()
    afterInjected() {
        const {
            baseUrl,
            headers,
            interceptors,
            search,
            fetcher,
            storageProvider: storageProviderClass,
            cacheStrategy: cacheStrategyClass,
            trigger: triggerClass
        } = this.configurationOptions;

        const storageProvider = this.appCtx.getInstance(
            storageProviderClass || MemoryStorageProvider
        ) as StorageProvider;
        const cacheStrategy = this.appCtx.getInstance(
            cacheStrategyClass || NoCacheStrategy
        ) as CacheStrategy;
        const trigger = this.appCtx.getInstance(
            triggerClass || ImmediateTrigger
        ) as HttpRequestTrigger;
        this.configuration = {
            baseUrl: new URL(globalThis.location.origin),
            interceptors: [],
            headers: HttpHeadersImpl.empty(),
            search: {},
            fetcher: internalFetcher,
            storageProvider: storageProvider,
            cacheStrategy,
            trigger,
            clone() {
                return {
                    ...this,
                    interceptors: this.interceptors.slice(0),
                    search: {
                        ...this.search
                    }
                };
            },
            validateStatus: internalValidateStatus
        };
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
                if (typeof interceptor === 'function') {
                    this.interceptorRegistry.addInterceptor({
                        name: 'functional-interceptor',
                        intercept: interceptor
                    });
                } else {
                    this.interceptorRegistry.addInterceptor(interceptor);
                }
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
        const worker = this.appCtx.getInstance(WorkerResource);
        worker.init(this.configuration.clone(), options);
        return worker;
    }
}
