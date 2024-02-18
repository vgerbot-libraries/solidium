import { Cloneable } from './Cloneable';
import { HttpConfiguration } from './HttpConfiguration';
import { HttpEntity } from './HttpEntity';
import { HttpHeaders } from './HttpHeaders';
import { HttpRequest } from './HttpRequest';

export interface HttpResponse<E extends HttpEntity = HttpEntity>
    extends Cloneable<HttpResponse> {
    body: E;
    headers: HttpHeaders;
    status: number;
    statusText: string;
    request: HttpRequest;
}
