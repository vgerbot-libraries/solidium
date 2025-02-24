import { EXECUTE, Resource } from '../../resource/Resource';
import { SolidiumRestResource } from './SolidumRestResource';

export function restfull<T>(...args: unknown[]): Resource<T> {
    const resource = new SolidiumRestResource<T>();
    resource[EXECUTE](Array.from(args));
    return resource;
}
