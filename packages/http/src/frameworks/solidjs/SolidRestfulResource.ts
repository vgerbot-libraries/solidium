import { Inject, InstanceScope, Scope } from '@vgerbot/ioc';
import { RestfulResource } from '../../resource/RestfulResource';
import { SolidReactiveState } from './SolidReactiveState';

@Scope(InstanceScope.TRANSIENT)
export class SolidRestfulResource<T, E = unknown> extends RestfulResource<
    T,
    E
> {
    @Inject()
    protected state!: SolidReactiveState<T, E>;
}
