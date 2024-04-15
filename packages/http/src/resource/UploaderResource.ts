import { HttpHeaders } from '../types/HttpHeaders';
import { HttpRequest } from '../types/HttpRequest';
import { HttpRequestOptions } from '../types/HttpRequestOptions';
import { HttpResponse } from '../types/HttpResponse';
import { DataResource } from './DataResource';
import { DelegateResource, DelegateResponse } from './DelegateResource';
import { Owner } from 'solid-js';
import { WorkerResource } from './WorkerResource';

class UploadResponse extends DelegateResponse implements HttpResponse {
    clone(): HttpResponse {
        throw new Error('Method not implemented.');
    }
    get progress() {
        return 0;
    }
    constructor(
        protected readonly origin: HttpResponse,
        private readonly owner: Owner | null
    ) {
        super(origin);
    }
}

export class UploaderResource extends DelegateResource<UploadResponse> {
    get response(): UploadResponse | undefined {
        throw new Error('Method not implemented.');
    }
    get responsePromise(): Promise<UploadResponse> {
        throw new Error('Method not implemented.');
    }
    constructor() {
        super(new WorkerResource());
    }
    init() {}
}
