import { HttpResponse } from '../core/HttpResponse';
import { Resource, SET_DATA, SET_ERROR } from './Resource';
import { ResourceStatus } from './ResourceStatus';

export abstract class JSONSSEResource<T> extends Resource<T> {
    abstract get data(): T;
    abstract get error(): unknown;

    protected abstract [SET_DATA](data: T): void;
    protected abstract [SET_ERROR](error: unknown): void;

    protected abstract get status(): ResourceStatus;
    protected abstract set status(status: ResourceStatus);

    protected async handleResponse(response: HttpResponse): Promise<void> {
        for await (const data of response.jsonStream()) {
            this[SET_DATA](data as T);
        }
    }
}
