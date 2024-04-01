import { HttpInterceptor } from '../types/HttpInterceptor';
import { HttpInterceptorRegistry } from '../types/InterceptorRegistry';
import { CommonInterceptorNameEnum } from './constants';
export declare class HttpInterceptorRegistryImpl implements HttpInterceptorRegistry {
    private interceptors;
    addInterceptor(interceptor: HttpInterceptor['intercept'], name: CommonInterceptorNameEnum | string): void;
    addInterceptor(interceptor: HttpInterceptor): void;
    getInterceptors(): HttpInterceptor[];
}
