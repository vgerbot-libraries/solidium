import { ApplicationContext, Factory, Inject, PostInject } from '@vgerbot/ioc';
import { HTTP_CONFIGURATION, HTTP_CONFIGURER } from './constants';

import { MemoryStorageProvider } from '../cache/provider/MemoryStorageProvider';
import { DefaultCacheStrategy } from '../cache/strategy/DefaultCacheStrategy';
import { createTrigger } from '../common/createTrigger';
import { keep } from '../common/keep';
import { ActuatorResource } from '../resource/ActuatorResource';
import { CacheStrategy } from '../types/CacheStrategy';
import {
    HttpConfiguration,
    HttpConfigurationOptions
} from '../types/HttpConfiguration';
import { HttpConfigurer } from '../types/HttpConfigurer';
import { CreateResourceOptions } from '../types/CreateResourceOptions';
import { Resource } from '../types/Resource';
import { isStorageProvider, StorageProvider } from '../types/StorageProvider';
import { HttpHeadersImpl } from './HttpHeadersImpl';
import { HttpInterceptorRegistryImpl } from './HttpInterceptorRegistryImpl';
import { internalValidateStatus } from './internalValidateStatus';
import { builtinFetcher } from './builtinFetcher';
import { mergeURLSearchParams } from '../common/mergeURLSearchParams';

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
            storageProviders: storageProviderDefs,
            defaultStorageProvider: defaultStorageProviderName,
            cacheStrategy: cacheStrategyClass,
            trigger: triggerOption
        } = this.configurationOptions;
        const appCtx = this.appCtx;

        const storageProviders = Object.keys(storageProviderDefs || {}).reduce(
            (acc, name, it) => {
                if (isStorageProvider(it)) {
                    acc[name] = it;
                    return acc;
                }
                if (typeof it !== 'function') {
                    throw new Error(`Invalid storage provider: ${name}!`);
                }
                const instance = appCtx.getInstance(it) as StorageProvider;
                acc[name] = instance;
                return acc;
            },
            {} as Record<string, StorageProvider>
        );

        const memoryStorageProvider = appCtx.getInstance(MemoryStorageProvider);

        const defaultStorageProvider =
            (() => {
                if (typeof defaultStorageProviderName === 'string') {
                    return storageProviders[defaultStorageProviderName];
                }
                if (isStorageProvider(defaultStorageProviderName)) {
                    return defaultStorageProviderName;
                }
                if (typeof defaultStorageProviderName === 'function') {
                    return appCtx.getInstance(
                        defaultStorageProviderName
                    ) as StorageProvider;
                }
            })() ?? memoryStorageProvider;

        const cacheStrategy = appCtx.getInstance(
            cacheStrategyClass || DefaultCacheStrategy
        ) as CacheStrategy;

        const defaultTrigger = createTrigger(
            this.appCtx,
            triggerOption || { immediate: true }
        );

        this.configuration = {
            baseUrl: undefined,
            interceptors: [],
            headers: HttpHeadersImpl.empty(),
            search: {},
            fetcher: fetcher || builtinFetcher,
            storageProviders,
            defaultStorageProvider,
            cacheStrategy,
            trigger: defaultTrigger,
            clone() {
                return {
                    ...this,
                    interceptors: this.interceptors.slice(0),
                    search: {
                        ...this.search
                    },
                    storageProviders,
                    defaultStorageProvider,
                    cacheStrategy: appCtx.getInstance(
                        cacheStrategyClass || DefaultCacheStrategy
                    ) as CacheStrategy,
                    trigger: defaultTrigger
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
        this.configuration.search = mergeURLSearchParams(
            this.configuration.search,
            search
        );

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

    createResource(options: CreateResourceOptions): Resource {
        const worker = this.appCtx.getInstance(ActuatorResource);
        worker.init(this.configuration.clone(), options);
        return worker;
    }
    getStorageProvider(
        storageProviderName: string = 'memory'
    ): StorageProvider {
        const { storageProviders, defaultStorageProvider } = this.configuration;
        const provider = storageProviders[storageProviderName];
        if (provider) {
            return provider;
        }
        if (typeof defaultStorageProvider === 'string') {
            const provider = storageProviders[defaultStorageProvider];
            if (provider) {
                return provider;
            }
        } else if (defaultStorageProvider) {
            return defaultStorageProvider;
        }
        return this.appCtx.getInstance(MemoryStorageProvider);
    }
}
