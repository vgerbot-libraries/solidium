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
import { HTTPError } from '../error/HTTPError';
import { UploadProgressEvent } from '../events/UploadProgressEvent';
import { DownloadProgressEvent } from '../events/DownloadProgressEvent';

enum ResourceStatus {
    IDLE = 'idle',
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILURE = 'failure'
}

@Scope(InstanceScope.TRANSIENT)
export class ActuatorResource implements Resource {
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
    public uploadProgress: number = 0;
    @Signal
    public downloadProgress: number = 0;
    @Signal
    private _response: HttpResponse | undefined;
    get response(): HttpResponse | undefined {
        return this._response;
    }
    @Signal
    private _error: HTTPError | undefined;
    public get error(): HTTPError | undefined {
        return this._error;
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
        const obtainProperty = <T extends keyof CreateResourceOptions>(
            key: T
        ): HttpRequestOptions[T] => {
            const value = options[key];
            if (typeof value === 'function') {
                return (value as () => HttpRequestOptions[T])();
            }
            return value as HttpRequestOptions[T];
        };
        return {
            key: obtainProperty('key'),
            path: obtainProperty('path'),
            params: obtainProperty('params'),
            parameterEncoder: options.parameterEncoder,
            method: options.method || HttpMethod.GET,
            body: obtainProperty('body'),
            headers: options.headers,
            search: obtainProperty('search'),
            trigger: options.trigger,
            fetcher: options.fetcher,
            interceptors: options.interceptors
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
        this._error = undefined;
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
                        const fetcher = request.fetcher;
                        const cleanupUploadProgressEventListener = request.on(
                            'uploadprogress',
                            (e: UploadProgressEvent) => {
                                this.uploadProgress =
                                    e.uploadedBytes / e.totalBytes;
                            }
                        );
                        const cleanupDownloadProgressEventListener = request.on(
                            'downloadprogress',
                            (e: DownloadProgressEvent) => {
                                this.downloadProgress =
                                    e.uploadedBytes / e.totalBytes;
                            }
                        );
                        return fetcher(request).finally(() => {
                            cleanupDownloadProgressEventListener();
                            cleanupUploadProgressEventListener();
                        });
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
