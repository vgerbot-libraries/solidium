import { lazyMember } from '@vgerbot/lazy';
import { HttpHeaders } from '../types/HttpHeaders';
import { HttpRequest } from '../types/HttpRequest';
import { HttpResponse } from '../types/HttpResponse';
import { Resource } from '../types/Resource';
import { DelegateResource } from './DelegateResource';
import { createSignal, Signal, getOwner, Owner, runWithOwner } from 'solid-js';

export class DataHttpResponse<T> implements HttpResponse {
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
    clone(): HttpResponse {
        return new DataHttpResponse(
            this.origin.clone(),
            this.owner,
            this.parser
        );
    }
    get data(): T | undefined {
        return this._jsonSignal[0]() as T | undefined;
    }
    private readonly _jsonSignal: Signal<unknown>;
    constructor(
        private readonly origin: HttpResponse,
        private readonly owner: Owner | null,
        private readonly parser: (blob: Blob) => Promise<T>
    ) {
        this._jsonSignal = runWithOwner(owner, () => {
            return createSignal();
        }) as Signal<unknown>;
        this.origin
            .body()
            .then(blob => parser(blob))
            .then(data => {
                this._jsonSignal[1](data as unknown);
            });
    }
}

export class DataResource<T> extends DelegateResource<DataHttpResponse<T>> {
    @lazyMember({
        evaluate: (instance: DataResource<T>) => {
            const origin = instance.target.response;
            return origin
                ? new DataHttpResponse(origin, instance.owner, instance.parser)
                : undefined;
        },
        resetBy: [(instance: DataResource<T>) => instance.target.response],
        enumerable: true
    })
    response: DataHttpResponse<T> | undefined;

    private readonly owner: Owner | null;
    public get data(): T | undefined {
        return this.response?.data;
    }
    public revalidate() {
        // TODO: REVALIDATE DATA RESOURCE
    }
    constructor(
        target: Resource<HttpResponse>,
        private readonly parser: (blob: Blob) => Promise<T>
    ) {
        super(target);
        this.owner = getOwner();
    }
}
