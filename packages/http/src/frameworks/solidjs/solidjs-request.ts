import { Newable } from 'packages/ioc/dist';
import { APPLICATION_CONTEXT } from '../../core/EndpointMembers';
import { getExecutionContext } from '../../core/execution-context';
import { EXECUTE, Resource } from '../../resource/Resource';
import { ArgumentsTracker } from './ArgumentsTracker';

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

    const tracker = appCtx.getInstance(ArgumentsTracker);
    tracker.track(args, args => {
        resource[EXECUTE](context, Array.from(args));
    });

    return resource;
}
