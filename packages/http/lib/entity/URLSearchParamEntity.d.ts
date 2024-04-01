import { ContentType } from '../types/ContentType';
import { HttpEntity } from '../types/HttpEntity';
export declare class URLSearchParamsEntity implements HttpEntity {
    private readonly formdata;
    constructor(formdata: URLSearchParams);
    contentType(): ContentType;
    data(): Promise<URLSearchParams>;
    size(): number;
    clone(): HttpEntity;
}
