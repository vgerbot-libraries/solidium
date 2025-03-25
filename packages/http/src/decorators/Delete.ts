import { createRequestDecorator, RequestOptions } from './Request';

export type DeleteRequestOptions = Omit<RequestOptions, 'method'>;
export function Delete(options: string | DeleteRequestOptions) {
    return createRequestDecorator(options, 'DELETE');
}
