import { HttpResponse } from '../core/HttpResponse';
import { HttpStatusError } from '../errors/HttpError';
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
        const httpStatus = await response.status();

        if (httpStatus >= 200 && httpStatus < 400) {
            // Set up progress tracking
            response.onDownload(progress => {
                this.updateProgress(progress);
            });

            try {
                // For download resources, we might want to get the data as blob or arrayBuffer
                // This would depend on the specific implementation
                // Here we're just setting up the progress tracking
            } catch (error) {
                this.status = ResourceStatus.ERROR;
                this[SET_ERROR](new ResourceError(error));
                throw error;
            }
        } else {
            // Handle error status
            const headers = await response.headers();

            // Create appropriate HTTP status error
            const httpError = new HttpStatusError(
                httpStatus,
                response.init.method.toString(),
                headers
            );

            this.status = ResourceStatus.ERROR;
            this[SET_ERROR](new ResourceError(httpError));
            throw httpError;
        }
    }

    protected abstract updateProgress(progress: Progress): void;
}
