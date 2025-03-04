import { Scope, InstanceScope } from '@vgerbot/ioc';
import { UploadResource } from '../../resource/UploadResource';
import { HttpResponse } from '../../core/HttpResponse';
import { Progress } from '../../progress/Progress';
import { ResourceError } from '../../resource/ResourceError';
import { ResourceStatus } from '../../resource/ResourceStatus';
import { Signal } from '@vgerbot/solidium';
import { SET_DATA, SET_ERROR } from '../../resource/Resource';

const DATA = Symbol('data');
const ERROR = Symbol('error');
const STATUS = Symbol('status');

@Scope(InstanceScope.TRANSIENT)
export class SolidjsUploadResource<
    T extends BodyInit
> extends UploadResource<T> {
    @Signal()
    private [DATA]!: T;
    @Signal()
    private [ERROR]!: ResourceError | null;
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
    protected [SET_ERROR](error: ResourceError | null): void {
        this[ERROR] = error;
    }
    get data(): T {
        return this[DATA];
    }
    get error(): ResourceError | null {
        return this[ERROR];
    }
    protected async handleHttpErrorResponse(
        response: HttpResponse
    ): Promise<void> {
        try {
            await response.json();
        } catch (error) {
            this.status = ResourceStatus.ERROR;
            this[SET_ERROR](new ResourceError(error));
            throw error;
        }
    }
}
