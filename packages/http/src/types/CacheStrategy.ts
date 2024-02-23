import { CacheProvider } from './CacheProvider';
import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';

export interface CacheStrategy {
    /**
     *
     * @param request
     * @param cacheProvider
     * @param invoke Called to send http request
     */
    execute(
        request: HttpRequest,
        cacheProvider: CacheProvider,
        invoke: (response?: HttpResponse) => Promise<void>
    ): Promise<void>;
}
