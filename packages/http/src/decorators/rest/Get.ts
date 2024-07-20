import { RestfulResourceOptions } from '../../types/CreateResourceOptions';
import { HttpMethod } from '../../types/HttpMethod';
import { Http } from '../Http';

export const Get = (options: string | Omit<RestfulResourceOptions, 'body'>) => {
    if (typeof options === 'string') {
        const searchParamsStr = options.split('?')[1];
        const searchParams = new URLSearchParams(searchParamsStr);
        return Http.JSON({
            path: options,
            search: searchParams,
            method: HttpMethod.GET
        });
    }
    return Http.JSON(options);
};
