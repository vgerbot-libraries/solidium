import { HttpHeaders } from './HttpHeaders';
import { HttpInterceptorRegistry } from './InterceptorRegistry';

export interface HttpConfigurer {
    configHeaders?(headers: HttpHeaders): void;
    addInterceptors?(registry: HttpInterceptorRegistry): void;
}
