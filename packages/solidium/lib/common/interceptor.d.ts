export type InterceptorFunction<T> = (this: T, oldValue: unknown, newValue: unknown) => unknown;
export declare function interceptor<T>(before: InterceptorFunction<T> | undefined, after: InterceptorFunction<T>): InterceptorFunction<T>;
