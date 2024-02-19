import { Cloneable } from './Cloneable';
import { HttpConfiguration } from './HttpConfiguration';
import { HttpHeaders } from './HttpHeaders';
import { HttpRequest } from './HttpRequest';

export interface HttpResponse extends Cloneable<HttpResponse> {
    body(): Promise<Blob>;
    headers: HttpHeaders;
    status: number;
    statusText: string;
    request: HttpRequest;
}
