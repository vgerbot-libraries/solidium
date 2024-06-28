declare type Newable<T> = {
    new (...args: unknown[]): T;
};
declare module 'is-plain-object' {
    export function isPlainObject(obj: unknown): obj is Record<string, unknown>;
}
