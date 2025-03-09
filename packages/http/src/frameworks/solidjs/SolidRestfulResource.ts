import { Inject, InstanceScope, Scope } from '@vgerbot/ioc';
import { Resource } from '../../resource/Resource';
import { SolidReactiveState } from './SolidReactiveState';

@Scope(InstanceScope.TRANSIENT)
export class SolidRestfulResource<T, E = unknown> extends Resource<T, E> {
    @Inject()
    protected state!: SolidReactiveState<T, E>;
}
