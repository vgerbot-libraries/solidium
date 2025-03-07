import { Inject, InstanceScope, Scope } from '@vgerbot/ioc';
import { Resource } from '../../resource/Resource';

import { SolidReactiveState } from './SolidReactiveState';

@Scope(InstanceScope.TRANSIENT)
export class SolidJSONSSEResource<T> extends Resource<T> {
    @Inject()
    protected state!: SolidReactiveState<T>;
}
