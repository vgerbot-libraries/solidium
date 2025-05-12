import { RequestAdapterConstructor } from '../adapter/RequestAdapter';
import { HttpHeaders } from '../http/HttpHeaders';
import { HttpMethod } from '../http/HttpMethod';

export interface ExecuteRequestMethodParams {
    readonly method: HttpMethod;
    readonly signal?: AbortSignal;
    readonly headers: HttpHeaders;
    readonly pathVariables: Record<string, string | number | boolean>;
    readonly queryParams: URLSearchParams;
    payload?: BodyInit;
    adapter?: RequestAdapterConstructor;
    args: unknown[];
}
