import { Inject, InstanceScope, Scope } from '@vgerbot/ioc';
import { Signal } from '@vgerbot/solidium';
import { HttpResponse } from '../../core/HttpResponse';
import { Progress } from '../../progress/Progress';
import { DownloadResource } from '../../resource/DownloadResource';
import { SolidReactiveState } from './SolidReactiveState';

@Scope(InstanceScope.TRANSIENT)
export abstract class SolidDownloadResource<
    T extends Blob | ArrayBuffer
> extends DownloadResource<T> {
    @Inject()
    protected state!: SolidReactiveState<T>;
    @Signal()
    progress: Progress = new Progress(0, 0);
    get messages(): T[] {
        return [this.data];
    }
    protected updateProgress(progress: Progress): void {
        this.progress = progress;
    }
}
export class SolidiumBlobResource extends SolidDownloadResource<Blob> {
    protected async *resolveResponseBody(
        response: HttpResponse
    ): AsyncGenerator<unknown, void, unknown> {
        const body = await response.body();
        const blob = await body.readAsBlob();
        yield blob;
    }
}

export class SolidiumArrayBufferResource extends SolidDownloadResource<ArrayBuffer> {
    protected async *resolveResponseBody(
        response: HttpResponse
    ): AsyncGenerator<unknown, void, unknown> {
        const body = await response.body();
        const buffer = await body.readAsBuffer();
        yield buffer;
    }
}
