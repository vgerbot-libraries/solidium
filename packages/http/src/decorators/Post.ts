import { createRequestDecorator, RequestOptions } from './Request';

export type PostRequestOptions = Omit<RequestOptions, 'method'>;
export function Post(options: string | PostRequestOptions) {
    return createRequestDecorator(options, 'POST');
}
