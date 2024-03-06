import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';

export interface CacheStrategy {
    /**
     *
     * @param request
     * @param invoke Called to send http request
     */
    execute(
        request: HttpRequest,
        invoke: (response?: HttpResponse) => Promise<HttpResponse>
    ): Promise<HttpResponse>;
    clearCache(request: HttpRequest): Promise<void>;
}
