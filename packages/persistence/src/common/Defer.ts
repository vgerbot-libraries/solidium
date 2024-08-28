export class Defer<T> {
    readonly promise: Promise<T>;
    declare resolve: (vale: T | PromiseLike<T>) => void;
    declare reject: (reason?: unknown) => void;
    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
