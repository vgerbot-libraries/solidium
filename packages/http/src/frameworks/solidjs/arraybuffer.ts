import { SolidiumArrayBufferResource } from './SolidDownloadResource';
import { solidjsRequest } from './solidjs-request';

export function arraybuffer(...args: unknown[]) {
    return solidjsRequest<ArrayBuffer, SolidiumArrayBufferResource>(
        args,
        SolidiumArrayBufferResource
    );
}
