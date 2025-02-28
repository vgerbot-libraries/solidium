import { Newable } from 'packages/ioc/dist';
import { APPLICATION_CONTEXT } from '../../core/EndpointMembers';
import { getExecutionContext } from '../../core/execution-context';
import { EXECUTE, Resource } from '../../resource/Resource';
import { Tracker } from './Tracker';

export function solidjsRequest<T, R extends Resource<T>>(
    args: unknown[],
    ResourceType: Newable<R>
) {
    const context = getExecutionContext();
    if (!context) {
        throw new Error('Unknown error!');
    }
    const appCtx = context.instance[APPLICATION_CONTEXT];
    const resource = appCtx.getInstance(ResourceType) as R;

    const tracker = appCtx.getInstance(Tracker);
    tracker.track(args, args => {
        resource[EXECUTE](Array.from(args));
    });

    return resource;
}
