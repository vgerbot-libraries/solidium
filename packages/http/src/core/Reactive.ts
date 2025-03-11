export type Reactive<T> = T | undefined | (() => T | undefined);
export type R<T> = Reactive<T>;
