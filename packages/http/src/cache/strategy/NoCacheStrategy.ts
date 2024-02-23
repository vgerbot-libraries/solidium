import { CacheProvider } from '../../types/CacheProvider';
import { CacheStrategy } from '../../types/CacheStrategy';
import { HttpRequest } from '../../types/HttpRequest';
import { HttpResponse } from '../../types/HttpResponse';

export class NoCacheStrategy implements CacheStrategy {
    execute(
        request: HttpRequest,
        cacheProvider: CacheProvider,
        next: (response?: HttpResponse | undefined) => Promise<void>
    ): Promise<void> {
        return next();
    }
}
