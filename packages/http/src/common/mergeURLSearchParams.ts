import { SearchParams } from '../types/SearchParams';
import { isObject } from './isObject';

export function mergeURLSearchParams(
    ...params: Array<SearchParams | undefined>
): URLSearchParams {
    const result = new URLSearchParams();
    params.forEach(params => {
        if (params instanceof URLSearchParams) {
            params.forEach((value, key) => {
                result.append(key, value);
            });
        } else if (isObject(params)) {
            for (const key in params) {
                const value = params[key];
                if (Array.isArray(value)) {
                    value.forEach(it => {
                        result.append(key, it + '');
                    });
                } else {
                    result.append(key, value + '');
                }
            }
        }
    });
    return result;
}
