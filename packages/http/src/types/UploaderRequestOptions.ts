import { HttpRequest } from './HttpRequest';
import { HttpRequestOptions } from './HttpRequestOptions';
import { HttpResponse } from './HttpResponse';

export interface UploaderRequestOptions extends HttpRequestOptions {
    fetcher: (request: HttpRequest) => Promise<HttpResponse>;
}
