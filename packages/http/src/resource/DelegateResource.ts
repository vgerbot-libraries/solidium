import { HTTPError } from '../error/HTTPError';
import { FetchResourceOptions } from '../types/FetchResourceOptions';
import { HttpHeaders } from '../types/HttpHeaders';
import { HttpRequest } from '../types/HttpRequest';
import { HttpResponse } from '../types/HttpResponse';
import { Resource } from '../types/Resource';

export abstract class DelegateResponse implements HttpResponse {
    body(): Promise<Blob> {
        return this.origin.body();
    }
    get headers(): HttpHeaders {
        return this.origin.headers;
    }
    get status(): number {
        return this.origin.status;
    }
    get statusText(): string {
        return this.origin.statusText;
    }
    get request(): HttpRequest {
        return this.origin.request;
    }
    constructor(protected readonly origin: HttpResponse) {}
    abstract clone(): HttpResponse;
}

export abstract class DelegateResource<T extends HttpResponse>
    implements Resource<T>
{
    get idle(): boolean {
        return this.target.idle;
    }
    get pending(): boolean {
        return this.target.pending;
    }
    get success(): boolean {
        return this.target.success;
    }
    get failure(): boolean {
        return this.target.failure;
    }
    get completed(): boolean {
        return this.target.completed;
    }
    get error(): HTTPError | undefined {
        return this.target.error;
    }
    abstract get response(): T | undefined;
    abstract get responsePromise(): Promise<T>;
    constructor(protected readonly target: Resource) {}

    fetch(options: FetchResourceOptions): Promise<void> {
        return this.target.fetch(options);
    }
}
