import { HttpEntity } from './HttpEntity';
import { HttpHeaders } from './HttpHeaders';
import { JSONType } from './JSONType';
import { SearchParams } from './SearchParams';

export interface FetchResourceOptions {
    params?: Record<string, unknown>;
    clearCache?: boolean;
    search?: SearchParams;
    headers?: HttpHeaders;
    body?: HttpEntity | BodyInit | JSONType;
}
