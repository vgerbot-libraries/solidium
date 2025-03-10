import { ByteStream } from '../../http/ByteStream';
import { SolidDownloadResource } from './SolidDownloadResource';
import { solidjsRequest } from './solidjs-request';

export function download(...args: unknown[]) {
    return solidjsRequest<ByteStream, SolidDownloadResource>(
        args,
        SolidDownloadResource
    );
}
