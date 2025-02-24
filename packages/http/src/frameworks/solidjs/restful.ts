import { EXECUTE } from '../../resource/Resource';
import { SolidiumRestResource } from './SolidumRestResource';

export function restfull<T>(args: unknown[]): SolidiumRestResource<T> {
    const resource = new SolidiumRestResource<T>();
    resource[EXECUTE](args);
    return resource;
}
