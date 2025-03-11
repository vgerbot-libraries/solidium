import { InstanceScope, Scope } from '@vgerbot/ioc';
import { SolidResource } from './SolidResource';

@Scope(InstanceScope.TRANSIENT)
export class SolidRestfulResource<T, E = unknown> extends SolidResource<T, E> {}
