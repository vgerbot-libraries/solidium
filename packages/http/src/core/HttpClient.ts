import { ApplicationContext, Factory, Inject, PostInject } from '@vgerbot/ioc';
import { HTTP_CONFIGURATION, HTTP_CONFIGURER } from './constants';

import { MemoryStorageProvider } from '../cache/provider/MemoryStorageProvider';
import { NoCacheStrategy } from '../cache/strategy/NoCacheStrategy';
import { createTrigger } from '../common/createTrigger';
import { keep } from '../common/keep';
import { WorkerResource } from '../resource/WorkerResource';
import { CacheStrategy } from '../types/CacheStrategy';
import {
    HttpConfiguration,
    HttpConfigurationOptions
} from '../types/HttpConfiguration';
import { HttpConfigurer } from '../types/HttpConfigurer';
import { HttpRequestOptions } from '../types/HttpRequestOptions';
import { Resource } from '../types/Resource';
import { StorageProvider } from '../types/StorageProvider';
import { HttpHeadersImpl } from './HttpHeadersImpl';
import { HttpInterceptorRegistryImpl } from './HttpInterceptorRegistryImpl';
import { internalValidateStatus } from './internalValidateStatus';
import { internalFetcher } from './internanFetcher';

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
            trigger: triggerOption
        } = this.configurationOptions;
        const appCtx = this.appCtx;

        const storageProvider = appCtx.getInstance(
            storageProviderClass || MemoryStorageProvider
        ) as StorageProvider;
        const cacheStrategy = appCtx.getInstance(
            cacheStrategyClass || NoCacheStrategy
        ) as CacheStrategy;

        const defaultTrigger = createTrigger(
            this.appCtx,
            triggerOption || { immediate: true }
        );

        this.configuration = {
            baseUrl: new URL(globalThis.location.origin),
            interceptors: [],
            headers: HttpHeadersImpl.empty(),
            search: {},
            fetcher: internalFetcher,
            storageProvider: storageProvider,
            cacheStrategy,
            trigger: defaultTrigger,
            clone() {
                return {
                    ...this,
                    interceptors: this.interceptors.slice(0),
                    search: {
                        ...this.search
                    },
                    storageProvider: appCtx.getInstance(
                        storageProviderClass || MemoryStorageProvider
                    ) as StorageProvider,
                    cacheStrategy: appCtx.getInstance(
                        cacheStrategyClass || NoCacheStrategy
                    ) as CacheStrategy,
                    trigger: createTrigger(appCtx, triggerOption)
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
