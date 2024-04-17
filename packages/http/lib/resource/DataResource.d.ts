import { HttpResponse } from '../types/HttpResponse';
import { Resource } from '../types/Resource';
import { DelegateResource, DelegateResponse } from './DelegateResource';
import { Owner } from 'solid-js';
export declare class DataHttpResponse<T> extends DelegateResponse implements HttpResponse {
    protected readonly origin: HttpResponse;
    private readonly owner;
    private readonly parser;
    clone(): HttpResponse;
    get data(): T | undefined;
    get parser_error(): Error | undefined;
    private readonly _dataSignal;
    private readonly _parserErrorSignal;
    constructor(origin: HttpResponse, owner: Owner | null, parser: (blob: Blob) => Promise<T>);
}
export declare class DataResource<T> extends DelegateResource<DataHttpResponse<T>> {
    private readonly parser;
    response: DataHttpResponse<T> | undefined;
    private readonly owner;
    get data(): T | undefined;
    get parser_error(): Error | undefined;
    get responsePromise(): Promise<DataHttpResponse<T>>;
    constructor(target: Resource<HttpResponse>, parser: (blob: Blob) => Promise<T>);
}
