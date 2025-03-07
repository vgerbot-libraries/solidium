import { HttpResponse } from '../core/HttpResponse';
import { Progress } from '../progress/Progress';
import { ProgressiveResource } from './ProgressiveResource';
import { Resource } from './Resource';

export abstract class UploadResource<T extends BodyInit, E = unknown>
    extends Resource<T, E>
    implements ProgressiveResource<T>
{
    abstract progress: Progress;

    protected async handleResponse(response: HttpResponse): Promise<void> {
        response.onUpload(progress => {
            this.updateProgress(progress);
        });
        return super.handleResponse(response);
    }

    protected abstract updateProgress(progress: Progress): void;
}
