import { Cloneable } from './Cloneable';
import { HttpConfiguration } from './HttpConfiguration';
import { HttpEntity } from './HttpEntity';
import { HttpHeaders } from './HttpHeaders';
import { HttpMethod } from './HttpMethod';

export interface HttpRequest extends Cloneable<HttpRequest> {
    key: string; // default to url.toString()
    url: URL;
    body: HttpEntity;
    headers: HttpHeaders;
    method: HttpMethod;
    configuration: HttpConfiguration;
}
