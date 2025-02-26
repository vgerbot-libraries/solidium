import { ProgressHandler } from '../progress/ProgressHandler';
import { ByteStream } from './ByteStream';
import { HttpHeaders } from './HttpHeaders';

export interface HttpSource {
    status(): Promise<number>;
    headers(): Promise<HttpHeaders>;
    body(): Promise<ByteStream>;
    onDownload(listener: ProgressHandler): () => void;
    onUpload(listener: ProgressHandler): () => void;
}
