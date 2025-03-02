import { HttpResponse } from '../core/HttpResponse';
import { HttpStatusError } from '../errors/HttpError';
import { Progress } from '../progress/Progress';
import { ProgressiveResource } from './ProgressiveResource';
import { Resource, SET_DATA, SET_ERROR } from './Resource';
import { ResourceError } from './ResourceError';
import { ResourceStatus } from './ResourceStatus';

export abstract class UploadResource<T extends Blob | ArrayBuffer>
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
            response.onUpload(progress => {
                this.updateProgress(progress);
            });

            try {
                // For upload resources, we might want to handle the response
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
            let responseBody: unknown = null;

            try {
                // Try to parse response body as JSON if possible
                responseBody = await response.json();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_) {
                try {
                    // If JSON parsing fails, try to get as text
                    responseBody = await response.text();
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (_) {
                    // If text fails too, leave as null
                }
            }

            // Create appropriate HTTP status error
            const httpError = new HttpStatusError(
                httpStatus,
                response.init.method.toString(),
                headers,
                responseBody
            );

            this.status = ResourceStatus.ERROR;
            this[SET_ERROR](new ResourceError(httpError));
            throw httpError;
        }
    }

    protected abstract updateProgress(progress: Progress): void;
}
