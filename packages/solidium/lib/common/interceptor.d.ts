export type SetterInterceptorFunction<T> = (this: T, oldValue: unknown, newValue: unknown) => unknown;
export declare function combineSetterInterceptor<T>(before: SetterInterceptorFunction<T> | undefined, after: SetterInterceptorFunction<T>): SetterInterceptorFunction<T>;
