export declare enum PromiseStatus {
    PENDING = "pending",
    FULFILLED = "fulfilled",
    REJECTED = "rejected"
}
declare const STATUS: unique symbol;
declare const FULFILLED_VALUE: unique symbol;
declare const REJECTED_REASON: unique symbol;
declare const ABORT_CONTROLLER: unique symbol;
export declare class Defer<T> {
    static resolve<T>(value: T | PromiseLike<T>): Defer<T>;
    static reject<T>(reason: unknown): Defer<T>;
    static fromArray<T>(array: ArrayLike<T | PromiseLike<T>>, mapfn?: (value: T | PromiseLike<T>) => Promise<T>): Defer<T[]>;
    static serial(array: ArrayLike<() => void | PromiseLike<void>>): Promise<void>;
    readonly promise: Promise<T>;
    readonly resolve: (value: T | PromiseLike<T>) => void;
    readonly reject: (reason?: unknown) => void;
    private [STATUS];
    private [FULFILLED_VALUE]?;
    private [REJECTED_REASON]?;
    private [ABORT_CONTROLLER];
    get status(): PromiseStatus;
    get isSettled(): boolean;
    get fullfilledValue(): T | undefined;
    get rejectedReason(): unknown;
    get isCancelled(): boolean;
    get signal(): AbortSignal;
    constructor();
    abort(message?: string): void;
    invokeOnCompletion(completionHandler: CompletionHandler<T>): typeof noop;
}
export type DisposableHandler = () => void;
export type CompletionHandler<T> = (this: Defer<T>, reason?: unknown) => DisposableHandler;
export declare class CancellationError extends Error {
    constructor(message?: string);
}
declare function noop(): void;
export {};
