import { HTTPError } from '../error/HTTPError';
import { HttpRequest } from '../types/HttpRequest';
import { HttpResponse } from '../types/HttpResponse';
import { Resource } from '../types/Resource';
export declare abstract class DelegateResource<T extends HttpResponse> implements Resource<T> {
    protected readonly target: Resource;
    get idle(): boolean;
    get pending(): boolean;
    get success(): boolean;
    get failure(): boolean;
    get completed(): boolean;
    get request(): HttpRequest;
    get error(): HTTPError | undefined;
    abstract get response(): T | undefined;
    abstract get responsePromise(): Promise<T>;
    constructor(target: Resource);
    refetch(force?: boolean): Promise<void>;
}
