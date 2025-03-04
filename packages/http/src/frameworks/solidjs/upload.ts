import { solidjsRequest } from './solidjs-request';
import { SolidjsUploadResource } from './SolidjsUploadResource';

export function upload(...args: unknown[]) {
    return solidjsRequest<BodyInit, SolidjsUploadResource<BodyInit>>(
        args,
        SolidjsUploadResource
    );
}
