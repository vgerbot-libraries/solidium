import { Signal } from '@vgerbot/solidium';
import { HttpResponse } from '../core/HttpResponse';
import { Progress } from '../progress/Progress';
import { ProgressiveResource } from './ProgressiveResource';
import { ResourceExecutionState } from './ResourceExecutionState';

export class UploadResource<
    T extends BodyInit,
    B = unknown
> extends ProgressiveResource<T, B> {
    @Signal()
    progress: Progress = new Progress(0, 0);

    protected updateProgress(progress: Progress): void {
        this.progress = progress;
    }

    protected async handleResponse(
        response: HttpResponse,
        state: ResourceExecutionState<T, B>
    ): Promise<void> {
        response.onUpload(progress => {
            this.updateProgress(progress);
        });
        return super.handleResponse(response, state);
    }
}
