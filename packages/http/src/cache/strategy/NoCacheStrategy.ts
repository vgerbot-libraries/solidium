import { CacheStrategy } from '../../types/CacheStrategy';
import { HttpRequest } from '../../types/HttpRequest';
import { HttpResponse } from '../../types/HttpResponse';

export class NoCacheStrategy implements CacheStrategy {
    execute(
        request: HttpRequest,
        next: (response?: HttpResponse | undefined) => Promise<void>
    ): Promise<void> {
        return next();
    }
}
