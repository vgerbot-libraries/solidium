import { HttpResponse } from '../../core/HttpResponse';
import { createSignal } from 'solid-js';

export enum RequestStatus {
    PENDING,
    SUCCESS,
    ABORTED,
    ERROR
}

export class DataResponse<Data> {
    private readonly statusSignal = createSignal(RequestStatus.PENDING);
    private readonly errorSignal = createSignal();
    private readonly dataSignal = createSignal<Data>();

    get data() {
        return this.dataSignal[0]();
    }
    get error() {
        return this.errorSignal[0]();
    }

    private get status() {
        return this.statusSignal[0]();
    }
    private set status(newStatus: RequestStatus) {
        this.statusSignal[1](newStatus);
    }

    static create<Data>(responsePromise: Promise<HttpResponse>) {
        const resp = new DataResponse<Data>(responsePromise);
        resp.execute();
        return resp;
    }

    private constructor(
        protected readonly responsePromise: Promise<HttpResponse>
    ) {}

    get pending() {
        return this.status === RequestStatus.PENDING;
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

    protected async execute() {
        try {
            const response = await this.responsePromise;
            const data: Data = await response.json();
            const setData = this.dataSignal[1];
            setData(() => data);
            this.status = RequestStatus.SUCCESS;
        } catch (error) {
            this.errorSignal[1](error);
            this.status = RequestStatus.ERROR;
        }
    }

    abort() {
        // TODO: abort the request
    }
}
