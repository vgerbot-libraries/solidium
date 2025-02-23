import { HttpResponse } from '../../core/HttpResponse';
export declare enum RequestStatus {
    PENDING = 0,
    SUCCESS = 1,
    ABORTED = 2,
    ERROR = 3
}
export declare class DataResponse<Data> {
    protected readonly responsePromise: Promise<HttpResponse>;
    private readonly statusSignal;
    private readonly errorSignal;
    private readonly dataSignal;
    get data(): Data | undefined;
    get error(): unknown;
    private get status();
    private set status(value);
    static create<Data>(responsePromise: Promise<HttpResponse>): DataResponse<Data>;
    private constructor();
    get pending(): boolean;
    get success(): boolean;
    get aborted(): boolean;
    get failure(): boolean;
    protected execute(): Promise<void>;
    abort(): void;
}
