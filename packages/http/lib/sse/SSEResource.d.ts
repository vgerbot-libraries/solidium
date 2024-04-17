import { Owner } from 'solid-js';
import { DelegateResource } from '../resource/DelegateResource';
import { HttpHeaders } from '../types/HttpHeaders';
import { HttpRequest } from '../types/HttpRequest';
import { HttpResponse } from '../types/HttpResponse';
import { Resource } from '../types/Resource';
export declare class SSEResponse<T> implements HttpResponse {
    private readonly origin;
    private readonly owner;
    private readonly chunkParser;
    body(): Promise<Blob>;
    get headers(): HttpHeaders;
    get status(): number;
    get statusText(): string;
    get request(): HttpRequest;
    clone(): HttpResponse;
    get data(): T[];
    private readonly _dataSignal;
    constructor(origin: HttpResponse, owner: Owner | null, chunkParser: (chunk: string) => T);
}
export declare class SSEResource<T> extends DelegateResource<SSEResponse<T>> {
    private readonly parser;
    response: SSEResponse<T> | undefined;
    /**
     * @description Get the last chunk of data
     */
    get chunk(): T | undefined;
    get data(): T[];
    get responsePromise(): Promise<SSEResponse<T>>;
    private readonly owner;
    constructor(target: Resource<HttpResponse>, parser: (chunk: string) => T);
}
