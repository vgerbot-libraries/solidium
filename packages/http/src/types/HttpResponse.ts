import { Cloneable } from './Cloneable';
import { HttpConfigurationOptions } from './HttpConfiguration';
import { HttpHeaders } from './HttpHeaders';
import { HttpRequest } from './HttpRequest';

export interface HttpResponse extends Cloneable<HttpResponse> {
    body(): Promise<Blob>;
    headers: HttpHeaders;
    status: number;
    statusText: string;
    request: HttpRequest;
}
