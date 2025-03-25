import { createRequestDecorator, RequestOptions } from './Request';

export type PutRequestOptions = Omit<RequestOptions, 'method'>;
export function Put(options: string | PutRequestOptions) {
    return createRequestDecorator(options, 'PUT');
}
