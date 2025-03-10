import { HttpResponse } from '../core/HttpResponse';
import { ByteStream } from '../http/ByteStream';
import { Progress } from '../progress/Progress';
import { ProgressiveResource } from './ProgressiveResource';
import { Resource } from './Resource';
import { ResourceExecutionState } from './ResourceExecutionState';

export abstract class DownloadResource
    extends Resource<ByteStream>
    implements ProgressiveResource<ByteStream>
{
    abstract progress: Progress;

    protected async handleResponse(
        response: HttpResponse,
        state: ResourceExecutionState<ByteStream, unknown>
    ): Promise<void> {
        // Set up progress tracking
        response.onDownload(progress => {
            this.updateProgress(progress);
        });

        return super.handleResponse(response, state);
    }

    protected abstract updateProgress(progress: Progress): void;
}
