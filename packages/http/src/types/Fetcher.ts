import { HttpRequest } from './HttpRequest';
import { HttpRequestController } from './HttpRequestController';
import { HttpResponse } from './HttpResponse';

export interface Fetcher {
    (
        request: HttpRequest,
        constroller: HttpRequestController
    ): Promise<HttpResponse>;
}
