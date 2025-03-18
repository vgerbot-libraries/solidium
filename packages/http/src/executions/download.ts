import { ByteStream } from '../http/ByteStream';
import { DownloadResource } from '../resource/DownloadResource';
import { execute } from './execute';

export function download(...args: unknown[]) {
    return execute<ByteStream, DownloadResource>(args, DownloadResource);
}
