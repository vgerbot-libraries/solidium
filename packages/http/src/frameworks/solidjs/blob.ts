import { SolidiumBlobResource } from './SolidDownloadResource';
import { solidjsRequest } from './solidjs-request';

export function blob(...args: unknown[]) {
    return solidjsRequest<Blob, SolidiumBlobResource>(
        args,
        SolidiumBlobResource
    );
}
