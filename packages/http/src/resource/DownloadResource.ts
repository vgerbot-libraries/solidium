import { HttpResponse } from '../core/HttpResponse';
import { Progress } from '../progress/Progress';
import { ProgressiveResource } from './ProgressiveResource';
import { Resource, SET_DATA, SET_ERROR } from './Resource';
import { ResourceError } from './ResourceError';
import { ResourceStatus } from './ResourceStatus';

export abstract class DownloadResource<T extends Blob | ArrayBuffer>
    extends Resource<T>
    implements ProgressiveResource<T>
{
    abstract progress: Progress;

    protected abstract [SET_DATA](data: T): void;
    protected abstract [SET_ERROR](error: ResourceError): void;

    protected abstract get status(): ResourceStatus;
    protected abstract set status(status: ResourceStatus);

    protected async handleResponse(response: HttpResponse): Promise<void> {
        // Set up progress tracking
        response.onDownload(progress => {
            this.updateProgress(progress);
        });

        return super.handleResponse(response);
    }

    protected abstract updateProgress(progress: Progress): void;
}
