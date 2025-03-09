import { solidjsRequest } from './solidjs-request';
import { SolidUploadResource } from './SolidUploadResource';

export function upload(...args: unknown[]) {
    return solidjsRequest<BodyInit, SolidUploadResource<BodyInit>>(
        args,
        SolidUploadResource
    );
}
