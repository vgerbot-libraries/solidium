import { HttpHeaders } from '../http/HttpHeaders';
import { HttpMethod } from '../http/HttpMethod';
import { RequestMethod } from '../core/RequestMethod';

export interface AdapterOptions {
    invokeMethod: RequestMethod;
    method: HttpMethod;
    url: string;
    headers: HttpHeaders;
    payload: FormData | string | Blob | undefined;
    timeout: number;
    signal: AbortSignal;
}
