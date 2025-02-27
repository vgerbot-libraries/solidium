import { APPLICATION_CONTEXT } from '../../core/EndpointMembers';
import { getExecutionContext } from '../../core/execution-context';
import { EXECUTE } from '../../resource/Resource';
import { SolidiumRestResource } from './SolidumRestResource';
import { Tracker } from './Tracker';

export function restfull<T>(...args: unknown[]) {
    const context = getExecutionContext();
    if (!context) {
        throw new Error('');
    }
    const appCtx = context.instance[APPLICATION_CONTEXT];
    const resource = appCtx.getInstance(
        SolidiumRestResource
    ) as SolidiumRestResource<T>;

    const tracker = appCtx.getInstance(Tracker);
    tracker.track(args, args => {
        resource[EXECUTE](Array.from(args));
    });

    return resource;
}
