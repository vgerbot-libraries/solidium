import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';

export interface Fetcher {
    (request: HttpRequest): Promise<HttpResponse>;
}
