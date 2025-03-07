import { HttpResponse } from '../core/HttpResponse';
import { Progress } from '../progress/Progress';
import { ProgressiveResource } from './ProgressiveResource';
import { Resource } from './Resource';

export abstract class DownloadResource<T extends Blob | ArrayBuffer>
    extends Resource<T>
    implements ProgressiveResource<T>
{
    abstract progress: Progress;

    protected async handleResponse(response: HttpResponse): Promise<void> {
        // Set up progress tracking
        response.onDownload(progress => {
            this.updateProgress(progress);
        });

        return super.handleResponse(response);
    }

    protected abstract updateProgress(progress: Progress): void;
}
