import { HTTPError } from '../error/HTTPError';
import { FetchResourceOptions } from '../types/FetchResourceOptions';
import { HttpHeaders } from '../types/HttpHeaders';
import { HttpRequest } from '../types/HttpRequest';
import { HttpResponse } from '../types/HttpResponse';
import { Resource } from '../types/Resource';
export declare abstract class DelegateResponse implements HttpResponse {
    protected readonly origin: HttpResponse;
    body(): Promise<Blob>;
    get headers(): HttpHeaders;
    get status(): number;
    get statusText(): string;
    get request(): HttpRequest;
    constructor(origin: HttpResponse);
    abstract clone(): HttpResponse;
}
export declare abstract class DelegateResource<T extends HttpResponse> implements Resource<T> {
    protected readonly target: Resource;
    get idle(): boolean;
    get pending(): boolean;
    get success(): boolean;
    get failure(): boolean;
    get completed(): boolean;
    get error(): HTTPError | undefined;
    abstract get response(): T | undefined;
    abstract get responsePromise(): Promise<T>;
    constructor(target: Resource);
    fetch(options: FetchResourceOptions): Promise<void>;
}
