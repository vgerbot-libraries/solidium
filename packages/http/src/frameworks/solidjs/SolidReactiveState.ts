import { Signal } from '@vgerbot/solidium';
import { RequestStatus } from '../../resource/RequestStatus';
import { ResourceError } from '../../resource/ResourceError';
import { InstanceScope, Scope } from '@vgerbot/ioc';
import { ResourceExecutionState } from '../../resource/ResourceExecutionState';

@Scope(InstanceScope.TRANSIENT)
export class SolidReactiveState<T, E = unknown> extends ResourceExecutionState<
    T,
    E
> {
    @Signal()
    public messages: T[] = [];
    @Signal()
    public data!: T;
    @Signal()
    public reason!: ResourceError<E> | null;
    @Signal()
    public status: RequestStatus = RequestStatus.IDLE;
}
