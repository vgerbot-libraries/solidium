import { InstanceScope, Scope } from '@vgerbot/ioc';
import { Resource } from './Resource';

@Scope(InstanceScope.TRANSIENT)
export class RestfulResource<T, E = unknown> extends Resource<T, E> {}
