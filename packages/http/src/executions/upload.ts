import { UploadResource } from '../resource/UploadResource';
import { execute } from './execute';

export function upload(...args: unknown[]) {
    return execute<BodyInit, UploadResource<BodyInit>>(args, UploadResource);
}
