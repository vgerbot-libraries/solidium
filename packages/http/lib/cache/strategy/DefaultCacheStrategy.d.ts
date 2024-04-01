import { CacheStrategy } from '../../types/CacheStrategy';
import { HttpRequest } from '../../types/HttpRequest';
import { HttpResponse } from '../../types/HttpResponse';
export declare class DefaultCacheStrategy implements CacheStrategy {
    execute(request: HttpRequest, next: (response?: HttpResponse | undefined) => Promise<HttpResponse>): Promise<HttpResponse>;
    clearCache(request: HttpRequest): Promise<void>;
}
