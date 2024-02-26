import { HttpInterceptor } from '../types/HttpInterceptor';
import { HttpRequest } from '../types/HttpRequest';
import { HttpResponse } from '../types/HttpResponse';
import { HttpInterceptorRegistry } from '../types/InterceptorRegistry';
import { CommonInterceptorNameEnum } from './constants';

export class HttpInterceptorRegistryImpl implements HttpInterceptorRegistry {
    private interceptors: HttpInterceptor[] = [];
    addInterceptor(
        interceptor: (
            request: HttpRequest,
            next: HttpInterceptor
        ) => Promise<HttpResponse>,
        name: CommonInterceptorNameEnum | string
    ): void;
    addInterceptor(interceptor: HttpInterceptor): void;
    addInterceptor(
        interceptor:
            | HttpInterceptor
            | ((
                  request: HttpRequest,
                  next: HttpInterceptor
              ) => Promise<HttpResponse>),
        name?: CommonInterceptorNameEnum | string
    ): void {
        if (typeof interceptor === 'function') {
            this.interceptors.push({
                name,
                intercept(request, next) {
                    return interceptor(request, next);
                }
            } as HttpInterceptor);
        } else {
            this.interceptors.push(interceptor);
        }
    }
    getInterceptors() {
        return this.interceptors.slice(0);
    }
}
