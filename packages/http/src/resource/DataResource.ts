import { Signal } from '@vgerbot/solidium';
import { HttpRequestImpl } from '../core/HttpRequestImpl';
import { HttpConfiguration } from '../types/HttpConfiguration';
import { HttpRequest } from '../types/HttpRequest';
import { HttpRequestOptions } from '../types/HttpRequestOptions';
import { HttpResponse } from '../types/HttpResponse';
import { Resource } from '../types/Resource';
import {
    ApplicationContext,
    Inject,
    InstanceScope,
    PreDestroy,
    Scope
} from '@vgerbot/ioc';
import { HttpRequestTrigger } from '../types/HttpRequestTrigger';

enum ResourceStatus {
    IDLE,
    PENDING,
    SUCCESS,
    FAILURE
}

@Scope(InstanceScope.TRANSIENT)
export class DataResource implements Resource {
    @Signal
    private status: ResourceStatus = ResourceStatus.IDLE;
    get idle(): boolean {
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
    _response: HttpResponse | undefined;
    get response(): HttpResponse | undefined {
        return this.pending || this.idle ? undefined : this._response;
    }
    request!: HttpRequest;
    @Inject()
    private appCtx!: ApplicationContext;
    private trigger!: HttpRequestTrigger;

    init(configuration: HttpConfiguration, requestOptions: HttpRequestOptions) {
        this.request = new HttpRequestImpl(configuration, requestOptions);
        this.trigger = this.appCtx.getInstance(configuration.trigger);
        this.trigger.start(async () => {
            await this.executeRequest();
        });
    }
    @PreDestroy()
    onCleanup() {
        this.trigger.stop();
    }
    private async executeRequest() {
        //
    }
}
