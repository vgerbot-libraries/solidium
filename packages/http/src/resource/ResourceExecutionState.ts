import { Subject } from 'rxjs';
import { RequestStatus } from './RequestStatus';
import { ResourceError } from './ResourceError';
import { Defer } from '../common/Defer';
import { HttpHeaders } from '../http/HttpHeaders';

export abstract class ResourceExecutionState<T, E> extends Subject<T> {
    public messages: T[] = [];
    public data!: T;
    public reason!: ResourceError<E> | null;
    public status: RequestStatus = RequestStatus.IDLE;
    public headers: HttpHeaders = new HttpHeaders();
    public httpStatus = 0;
    public abortController = new AbortController();
    private readonly defer = new Defer<T>();
    init() {
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
            },
            complete: () => {
                if (this.success) {
                    this.defer.resolve(this.data);
                } else {
                    this.defer.reject(this.reason);
                }
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
    then(
        onFulfilled?: ((value: T) => T | PromiseLike<T>) | undefined,
        onRejected?: ((reason: unknown) => T | PromiseLike<T>) | undefined
    ): Promise<T> {
        return this.defer.promise.then(onFulfilled, onRejected);
    }
    catch(
        onRejected?: ((reason: unknown) => T | PromiseLike<T>) | undefined
    ): Promise<T> {
        return this.defer.promise.catch(onRejected);
    }
    finally(onFinally?: (() => void) | undefined): Promise<T> {
        return this.defer.promise.finally(onFinally);
    }
}
