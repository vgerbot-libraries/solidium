import { HttpRequestOptions } from './HttpRequestOptions';

type FunctionalProperties<T, K extends keyof T> = {
    [P in keyof T]: P extends K ? T[P] | (() => T[P]) : T[P];
};

export type CreateResourceOptions = FunctionalProperties<
    HttpRequestOptions,
    'url' | 'body' | 'queries' | 'key'
>;
