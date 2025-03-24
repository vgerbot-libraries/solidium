import { InstanceScope, PostInject, Scope } from '@vgerbot/ioc';
import { Signal } from '@vgerbot/solidium';
import { ReplaySubject } from 'rxjs';
import { HttpHeaders } from '../http/HttpHeaders';
import { RequestStatus } from './RequestStatus';
import { ResourceError } from './ResourceError';

@Scope(InstanceScope.TRANSIENT)
export class ResourceExecutionState<T, E = unknown> extends ReplaySubject<T> {
    @Signal()
    public messages: T[] = [];
    @Signal()
    public data?: T;
    @Signal()
    public reason!: ResourceError<E> | null;
    @Signal()
    public status: RequestStatus = RequestStatus.IDLE;
    public headers: HttpHeaders = new HttpHeaders();
    public httpStatus = 0;
    public abortController = new AbortController();
    constructor() {
        super(1);
    }
    @PostInject()
    protected init() {
        this.subscribe({
            next: value => {
                this.data = value;
                this.messages = this.messages.concat(value);
            },
            error: err => {
                this.reason = err;
                this.status =
                    err instanceof ResourceError && err.isAbortError
                        ? RequestStatus.ABORTED
                        : RequestStatus.ERROR;
            }
        });
    }
    headerReceived(headers: HttpHeaders, httpStatus: number) {
        this.headers = headers;
        this.httpStatus = httpStatus;
    }

    get idle() {
        return this.status === RequestStatus.IDLE;
    }
    get opened() {
        return this.status === RequestStatus.OPENED;
    }
    get loading() {
        return this.status === RequestStatus.LOADING;
    }
    get success() {
        return this.status === RequestStatus.SUCCESS;
    }
    get aborted() {
        return this.status === RequestStatus.ABORTED;
    }
    get failure() {
        return this.status === RequestStatus.ERROR;
    }
    reset() {
        this.status = RequestStatus.IDLE;
        this.headers.clear();
        this.httpStatus = 0;
        this.data = undefined;
        this.reason = null;
        this.messages = [];
    }
}
