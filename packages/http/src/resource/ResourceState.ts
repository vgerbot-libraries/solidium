import { ResourceError } from './ResourceError';
import { ResourceStatus } from './ResourceStatus';

export abstract class ResourceState<T, E> {
    public messages: T[] = [];
    public data!: T;
    public error!: ResourceError<E> | null;
    public status: ResourceStatus = ResourceStatus.IDLE;

    appendMessage(data: T) {
        this.data = data;
        this.messages = this.messages.concat(data);
    }
}
