import { HTTPError } from '../error/HTTPError';
import { HttpRequest } from '../types/HttpRequest';
import { HttpResponse } from '../types/HttpResponse';
import { Resource } from '../types/Resource';

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
    get request(): HttpRequest {
        return this.target.request;
    }
    get error(): HTTPError | undefined {
        return this.target.error;
    }
    abstract get response(): T | undefined;
    abstract get responsePromise(): Promise<T>;
    constructor(protected readonly target: Resource) {}

    refetch(force?: boolean): Promise<void> {
        return this.target.refetch(force);
    }
}
