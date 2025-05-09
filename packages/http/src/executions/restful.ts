import { execute } from './execute';
import { RestfulResource } from '../resource/RestfulResource';

export function restful<T, A extends unknown[] = unknown[]>(...args: A) {
    return execute<T, RestfulResource<T>>(args, RestfulResource);
}
