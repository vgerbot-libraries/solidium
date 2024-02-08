import { Cloneable } from './Cloneable';
import { HttpEntity } from './HttpEntity';
import { HttpHeaders } from './HttpHeaders';

export interface HttpRequest extends Cloneable<HttpRequest> {
    url: URL;
    body: HttpEntity;
    headers: HttpHeaders;
}
