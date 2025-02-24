import { createRequestDecorator, RequestOptions } from './Request';

export type GetRequestOptions = Omit<RequestOptions, 'method'>;

export function Get(options: string | GetRequestOptions) {
    return createRequestDecorator(options, 'GET');
}
