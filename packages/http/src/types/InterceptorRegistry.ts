import { HttpInterceptor } from './HttpInterceptor';

export interface HttpInterceptorRegistry {
    addInterceptor(
        interceptor: HttpInterceptor | HttpInterceptor['intercept']
    ): void;
}
