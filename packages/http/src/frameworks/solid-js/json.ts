import { request } from '../../core/request';
import { DataResponse } from './DataResponse';

export function json<T>(...args: unknown[]) {
    return DataResponse.create<T>(request(...args));
}
