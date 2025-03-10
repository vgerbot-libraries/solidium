import { InstanceScope, Scope } from '@vgerbot/ioc';
import { Signal } from '@vgerbot/solidium';
import { HttpResponse } from '../../core/HttpResponse';
import { Progress } from '../../progress/Progress';
import { DownloadResource } from '../../resource/DownloadResource';
import { ByteStream } from '../../http/ByteStream';

@Scope(InstanceScope.TRANSIENT)
export class SolidDownloadResource extends DownloadResource {
    @Signal()
    progress: Progress = new Progress(0, 0);

    protected updateProgress(progress: Progress): void {
        this.progress = progress;
    }
    protected async *resolveResponseBody(
        response: HttpResponse
    ): AsyncGenerator<ByteStream, void, unknown> {
        yield response.body();
    }
}
