import {
    ApplicationContext,
    Inject,
    InstanceScope,
    PreDestroy,
    Scope
} from '@vgerbot/ioc';
import { Signal } from '@vgerbot/solidium';
import { createEffect, on } from 'solid-js';
import { Defer } from '../common/Defer';
import { createTrigger } from '../common/createTrigger';
import { noop } from '../common/noop';
import { HttpRequestImpl } from '../core/HttpRequestImpl';
import { PassiveTrigger } from '../trigger';
import { HttpConfiguration } from '../types/HttpConfiguration';
import { HttpMethod } from '../types/HttpMethod';
import { HttpRequest } from '../types/HttpRequest';
import { HttpRequestOptions } from '../types/HttpRequestOptions';
import { HttpResponse } from '../types/HttpResponse';
import { Resource } from '../types/Resource';
import { CreateResourceOptions } from '../types/CreateResourceOptions';

enum ResourceStatus {
    IDLE = 'idle',
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILURE = 'failure'
}

@Scope(InstanceScope.TRANSIENT)
export class WorkerResource implements Resource {
    @Inject()
    private appCtx!: ApplicationContext;
    @Signal
    private status: ResourceStatus = ResourceStatus.IDLE;
    get idle() {
        return this.status === ResourceStatus.IDLE;
    }
    get pending(): boolean {
        return this.status === ResourceStatus.PENDING;
    }
    get success(): boolean {
        return this.status === ResourceStatus.SUCCESS;
    }
    get failure(): boolean {
        return this.status === ResourceStatus.FAILURE;
    }
    get completed(): boolean {
        return this.success || this.failure;
    }
    @Signal
    private _response: HttpResponse | undefined;
    get response(): HttpResponse | undefined {
        return this._response;
    }
    request!: HttpRequest;
    private stopTrigger = noop;
    private responseDefer = new Defer<HttpResponse>();
    public get responsePromise() {
        return this.responseDefer.promise;
    }

    init(
        configuration: HttpConfiguration,
        createResourceOptions: CreateResourceOptions
    ) {
        createEffect(
            on(
                () => {
                    return this.convertToRequestOptions(createResourceOptions);
                },
                requestOptions => {
                    this.stopTrigger();
                    this.request = new HttpRequestImpl(
                        configuration,
                        requestOptions
                    );
                    const trigger =
                        createTrigger(this.appCtx, requestOptions.trigger) ||
                        configuration.trigger ||
                        new PassiveTrigger();

                    this.stopTrigger = trigger.dispatch(() => {
                        return this.refetch();
                    });
                }
            )
        );
    }
    private convertToRequestOptions(options: CreateResourceOptions) {
        const obtainProperty = (
            key: keyof CreateResourceOptions
        ): HttpRequestOptions[keyof HttpRequestOptions] => {
            const value = options[key];
            if (typeof value === 'function') {
                return value();
            }
            return value;
        };
        return {
            key: obtainProperty('key'),
            url: obtainProperty('url'),
            method: options.method || HttpMethod.GET,
            body: obtainProperty('body'),
            headers: options.headers,
            queries: obtainProperty('queries'),
            trigger: options.trigger
        } as HttpRequestOptions;
    }
    @PreDestroy()
    onCleanup() {
        this.stopTrigger();
    }
    async refetch(clearCache?: boolean) {
        if (this.pending) {
            try {
                await this.responseDefer.promise;
            } catch (_) {
                // IGNORE
            }
            this.responseDefer = new Defer();
        }
        this.status = ResourceStatus.PENDING;
        this._response = undefined;
        try {
            const configuration = this.request.configuration;
            const response = await this.executeRequest(clearCache);
            await configuration.validateStatus(response);
            this.status = ResourceStatus.SUCCESS;
            this._response = response;
            this.responseDefer.resolve(response);
        } catch (error) {
            this.status = ResourceStatus.FAILURE;
            this.responseDefer.reject(error);
        }
    }
    private async executeRequest(clearCache?: boolean) {
        const configuration = this.request.configuration;
        const executeRequest = async (
            request: HttpRequest
        ): Promise<HttpResponse> => {
            const cacheStrategy = request.configuration.cacheStrategy;
            if (clearCache) {
                await cacheStrategy.clearCache(request);
            }
            return request.configuration.cacheStrategy.execute(
                request,
                async (cachedResponse?: HttpResponse) => {
                    if (cachedResponse) {
                        return Promise.resolve(cachedResponse);
                    } else {
                        const fetcher = request.configuration.fetcher;
                        return fetcher(request);
                    }
                }
            );
        };
        const interceptedRequestExecutor =
            configuration.interceptors.reduceRight((next, interceptor) => {
                return (request: HttpRequest) => {
                    return interceptor.intercept(request, next);
                };
            }, executeRequest);
        return interceptedRequestExecutor(this.request.clone());
    }
}
