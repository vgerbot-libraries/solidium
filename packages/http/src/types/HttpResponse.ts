import { Cloneable } from './Cloneable';
import { HttpEntity } from './HttpEntity';
import { HttpHeaders } from './HttpHeaders';

export interface HttpResponse extends Cloneable<HttpResponse> {
    body: HttpEntity;
    headers: HttpHeaders;
}
