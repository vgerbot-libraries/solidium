import { Signal } from '@vgerbot/solidium';
import { HttpRequestImpl } from '../core/HttpRequestImpl';
import { HttpConfiguration } from '../types/HttpConfiguration';
import { HttpRequest } from '../types/HttpRequest';
import { HttpRequestOptions } from '../types/HttpRequestOptions';
import { HttpResponse } from '../types/HttpResponse';
import { Resource } from '../types/Resource';
import { InstanceScope, PreDestroy, Scope } from '@vgerbot/ioc';
import { HttpRequestTrigger } from '../types/HttpRequestTrigger';
import { Defer } from '../common/Defer';
import { HttpMethod } from '../types/HttpMethod';

enum ResourceStatus {
    IDLE = 'idle',
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILURE = 'failure'
}

@Scope(InstanceScope.TRANSIENT)
export class WorkerResource implements Resource {
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
    private trigger!: HttpRequestTrigger;

    init(configuration: HttpConfiguration, requestOptions: HttpRequestOptions) {
        this.request = new HttpRequestImpl(configuration, requestOptions);
        this.trigger = configuration.trigger;
        this.trigger.start(async () => {
            this.status = ResourceStatus.PENDING;
            const response = await this.executeRequest();
            if (await configuration.validateStatus(response)) {
                this.status = ResourceStatus.SUCCESS;
            } else {
                this.status = ResourceStatus.FAILURE;
            }
            this._response = response;
        });
    }
    @PreDestroy()
    onCleanup() {
        this.trigger.stop();
    }
    private async executeRequest() {
        const configuration = this.request.configuration;
        const executeRequest = (
            request: HttpRequest
        ): Promise<HttpResponse> => {
            switch (request.method) {
                case HttpMethod.PUT:
                case HttpMethod.DELETE:
                case HttpMethod.PATCH:
                case HttpMethod.POST:
                    return this.executeRequestWithoutCache(request);
            }
            return this.executeRequestWithCache(request);
        };
        const interceptedRequestExecutor =
            configuration.interceptors.reduceRight((next, interceptor) => {
                return (request: HttpRequest) => {
                    return interceptor.intercept(request, next);
                };
            }, executeRequest);
        return interceptedRequestExecutor(this.request);
    }
    private executeRequestWithoutCache(
        request: HttpRequest
    ): Promise<HttpResponse> {
        const fetcher = request.configuration.fetcher;
        return fetcher(request);
    }
    private executeRequestWithCache(
        request: HttpRequest
    ): Promise<HttpResponse> {
        const defer = new Defer<HttpResponse>();
        request.configuration.cacheStrategy.execute(
            request,
            async (cachedResponse?: HttpResponse) => {
                if (cachedResponse) {
                    defer.resolve(cachedResponse);
                } else {
                    const fetcher = request.configuration.fetcher;
                    fetcher(request).then(defer.resolve, defer.reject);
                }
            }
        );
        return defer.promise;
    }
}
