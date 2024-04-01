import { SetterInterceptorOptions } from '../helper/appendSetterInterceptor';
export declare const SETTER_INTERCEPTOR_METHOD_MARK_KEY: unique symbol;
export declare const SetterInterceptor: (options: string | symbol | SetterInterceptorOptions) => MethodDecorator;
