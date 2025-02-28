import { Signal } from '@vgerbot/solidium';
import { Scope, InstanceScope } from '@vgerbot/ioc';
import { Progress } from '../../progress/Progress';
import { DownloadResource } from '../../resource/DownloadResource';
import { ResourceStatus } from '../../resource/ResourceStatus';
import { SET_DATA, SET_ERROR } from '../../resource/Resource';
import { HttpResponse } from '../../core/HttpResponse';

const DATA = Symbol('data');
const ERROR = Symbol('error');
const STATUS = Symbol('status');

@Scope(InstanceScope.TRANSIENT)
export abstract class SolidDownloadResource<
    T extends Blob | ArrayBuffer
> extends DownloadResource<T> {
    @Signal()
    private [DATA]!: T;
    @Signal()
    private [ERROR]: unknown;
    @Signal()
    progress: Progress = new Progress(0, 0);
    @Signal()
    private [STATUS]: ResourceStatus = ResourceStatus.IDLE;
    protected get status(): ResourceStatus {
        return this[STATUS];
    }
    protected set status(status: ResourceStatus) {
        this[STATUS] = status;
    }
    protected updateProgress(progress: Progress): void {
        this.progress = progress;
    }
    protected [SET_DATA](data: T): void {
        this[DATA] = data;
    }
    protected [SET_ERROR](error: unknown): void {
        this[ERROR] = error;
    }
    get data(): T {
        return this[DATA];
    }
    get error(): unknown {
        return this[ERROR];
    }
}
export class SolidiumBlobResource extends SolidDownloadResource<Blob> {
    protected async handleResponse(response: HttpResponse): Promise<void> {
        await super.handleResponse(response);
        const body = await response.body();
        const blob = await body.readAsBlob();
        this[SET_DATA](blob);
    }
}

export class SolidiumArrayBufferResource extends SolidDownloadResource<ArrayBuffer> {
    protected async handleResponse(response: HttpResponse): Promise<void> {
        await super.handleResponse(response);
        const body = await response.body();
        const buffer = await body.readAsBuffer();
        this[SET_DATA](buffer);
    }
}
