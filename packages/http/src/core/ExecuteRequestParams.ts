import { RequestAdapterConstructor } from '../adapter/RequestAdapter';
import { HttpHeaders } from '../http/HttpHeaders';

export interface ExecuteRequestMethodParams {
    readonly signal?: AbortSignal;
    readonly headers: HttpHeaders;
    readonly pathVariables: Record<string, string | number | boolean>;
    readonly queryParams: URLSearchParams;
    payload?: BodyInit;
    adapter?: RequestAdapterConstructor;
    args: unknown[];
}
