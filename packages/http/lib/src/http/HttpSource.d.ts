import { ByteStream } from './ByteStream';
import { HttpHeaders } from './HttpHeaders';
export interface HttpSource {
    headers(): Promise<HttpHeaders>;
    body(): Promise<ByteStream>;
}
