export declare class Defer<T> {
    readonly promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason: unknown) => void;
    constructor();
}
