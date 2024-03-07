import { Owner, getOwner, Signal, createSignal, runWithOwner } from 'solid-js';
import { DelegateResource } from '../resource/DelegateResource';
import { HttpHeaders } from '../types/HttpHeaders';
import { HttpRequest } from '../types/HttpRequest';
import { HttpResponse } from '../types/HttpResponse';
import { chunkIterator } from '../common/chunkIterator';
import { Resource } from '../types/Resource';
import { lazyMember } from '@vgerbot/lazy';

export class SSEResponse<T> implements HttpResponse {
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
        throw new Error('Method not implemented.');
    }
    public get data(): T[] {
        return this._dataSignal[0]();
    }
    private readonly _dataSignal!: Signal<T[]>;
    constructor(
        private readonly origin: HttpResponse,
        private readonly owner: Owner | null,
        chunkParser: (chunk: string) => T
    ) {
        this._dataSignal = runWithOwner(this.owner, () => {
            return createSignal([] as T[]);
        }) as Signal<T[]>;
        (async () => {
            const blob = await this.origin.body();
            const decoder = new TextDecoder();
            for await (const chunk of chunkIterator(blob.stream())) {
                const chunkText = decoder.decode(chunk);
                const text = chunkText
                    .replace(/^data:\s+/, '')
                    .replace(/\n+^/, '');
                const data = chunkParser(text);
                const [allData, setAllData] = this._dataSignal;
                setAllData(allData().concat(data));
            }
        })();
    }
}

export class SSEResource<T> extends DelegateResource<SSEResponse<T>> {
    @lazyMember({
        evaluate: (instance: SSEResource<T>) => {
            const origin = instance.target.response;
            return origin
                ? new SSEResponse(origin, instance.owner, instance.parser)
                : undefined;
        },
        resetBy: [(instance: SSEResource<T>) => instance.target.response],
        enumerable: true
    })
    response: SSEResponse<T> | undefined;
    /**
     * @description Get the last chunk of data
     */
    public get chunk(): T | undefined {
        const data = this.data;
        return data[data.length - 1];
    }
    public get data(): T[] {
        return this.response?.data || ([] as T[]);
    }
    public get responsePromise(): Promise<SSEResponse<T>> {
        return this.target.responsePromise.then(() => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this.response!;
        });
    }
    private readonly owner: Owner | null;
    constructor(
        target: Resource<HttpResponse>,
        private readonly parser: (chunk: string) => T
    ) {
        super(target);
        this.owner = getOwner();
    }
}
