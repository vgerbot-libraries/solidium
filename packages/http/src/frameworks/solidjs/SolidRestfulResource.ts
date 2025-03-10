import { InstanceScope, Scope } from '@vgerbot/ioc';
import { Resource } from '../../resource/Resource';

@Scope(InstanceScope.TRANSIENT)
export class SolidRestfulResource<T, E = unknown> extends Resource<T, E> {}
