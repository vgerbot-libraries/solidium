import { lazyMember } from '@vgerbot/lazy';
import { HttpResponse } from '../types/HttpResponse';
import { Resource } from '../types/Resource';
import { DelegateResource, DelegateResponse } from './DelegateResource';
import { createSignal, Signal, getOwner, Owner, runWithOwner } from 'solid-js';

export class DataHttpResponse<T>
    extends DelegateResponse
    implements HttpResponse
{
    clone(): HttpResponse {
        return new DataHttpResponse(
            this.origin.clone(),
            this.owner,
            this.parser
        );
    }
    get data(): T | undefined {
        return this._dataSignal[0]() as T | undefined;
    }
    get parser_error(): Error | undefined {
        return this._parserErrorSignal[0]();
    }
    private readonly _dataSignal: Signal<unknown>;
    private readonly _parserErrorSignal: Signal<Error | undefined>;
    constructor(
        protected readonly origin: HttpResponse,
        private readonly owner: Owner | null,
        private readonly parser: (blob: Blob) => Promise<T>
    ) {
        super(origin);
        this._dataSignal = runWithOwner(owner, () => {
            return createSignal();
        }) as Signal<unknown>;
        this._parserErrorSignal = runWithOwner(owner, () => {
            return createSignal();
        }) as Signal<Error | undefined>;
        this.origin
            .body()
            .then(blob =>
                parser(blob).catch(reason => {
                    this._parserErrorSignal[1](reason);
                    return undefined;
                })
            )
            .then(data => {
                this._dataSignal[1](data as unknown);
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
    public get parser_error(): Error | undefined {
        return this.response?.parser_error;
    }
    public get responsePromise(): Promise<DataHttpResponse<T>> {
        return this.target.responsePromise.then(() => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this.response!;
        });
    }
    constructor(
        target: Resource<HttpResponse>,
        private readonly parser: (blob: Blob) => Promise<T>
    ) {
        super(target);
        this.owner = getOwner();
    }
}
