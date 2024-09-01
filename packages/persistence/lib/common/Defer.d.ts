export declare class Defer<T> {
    readonly promise: Promise<T>;
    resolve: (vale: T | PromiseLike<T>) => void;
    reject: (reason?: unknown) => void;
    constructor();
}
