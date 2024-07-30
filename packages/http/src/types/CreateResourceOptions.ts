import { HttpRequestOptions } from './HttpRequestOptions';

export type CreateResourceOptions = HttpRequestOptions;

export type RestfulResourceOptions = Omit<CreateResourceOptions, 'method'>;
