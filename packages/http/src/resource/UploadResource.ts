import { HttpResponse } from '../core/HttpResponse';
import { Progress } from '../progress/Progress';
import { ProgressiveResource } from './ProgressiveResource';
import { Resource } from './Resource';
import { ResourceExecutionState } from './ResourceExecutionState';

export abstract class UploadResource<T extends BodyInit, B = unknown>
    extends Resource<T, B>
    implements ProgressiveResource<T, B>
{
    abstract progress: Progress;

    protected async handleResponse(
        response: HttpResponse,
        state: ResourceExecutionState<T, B>
    ): Promise<void> {
        response.onUpload(progress => {
            this.updateProgress(progress);
        });
        return super.handleResponse(response, state);
    }

    protected updateProgress(progress: Progress): void {
        this.progress = progress;
    }
}
