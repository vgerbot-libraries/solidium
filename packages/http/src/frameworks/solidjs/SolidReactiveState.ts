import { Signal } from '@vgerbot/solidium';
import { RequestStatus } from '../../resource/RequestStatus';
import { ResourceError } from '../../resource/ResourceError';
import { InstanceScope, Scope } from '@vgerbot/ioc';
import { ResourceState } from '../../resource/ResourceState';

@Scope(InstanceScope.TRANSIENT)
export class SolidReactiveState<T, E = unknown> extends ResourceState<T, E> {
    @Signal()
    public messages: T[] = [];
    @Signal()
    public data!: T;
    @Signal()
    public error!: ResourceError<E> | null;
    @Signal()
    public status: RequestStatus = RequestStatus.IDLE;
}
