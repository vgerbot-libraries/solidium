import { execute } from './execute';
import { RestfulResource } from '../resource/RestfulResource';

export function restful<T>(...args: unknown[]) {
    return execute<T, RestfulResource<T>>(args, RestfulResource);
}
