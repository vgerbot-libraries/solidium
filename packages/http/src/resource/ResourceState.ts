import { ResourceError } from './ResourceError';
import { RequestStatus } from './RequestStatus';

export abstract class ResourceState<T, E> {
    public messages: T[] = [];
    public data!: T;
    public error!: ResourceError<E> | null;
    public status: RequestStatus = RequestStatus.IDLE;

    appendMessage(data: T) {
        this.data = data;
        this.messages = this.messages.concat(data);
    }
}
