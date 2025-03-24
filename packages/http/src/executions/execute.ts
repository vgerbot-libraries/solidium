import { Newable } from '@vgerbot/ioc';
import { APPLICATION_CONTEXT } from '../core/EndpointMembers';
import { getExecutionContext } from '../core/execution-context';
import { EXECUTE, Resource } from '../resource/Resource';
import { ArgumentsTracker } from './ArgumentsTracker';

export function execute<T, R extends Resource<T>>(
    args: unknown[],
    ResourceType: Newable<R>
) {
    const context = getExecutionContext();
    if (!context) {
        throw new Error('Unknown error!');
    }
    const appCtx = context.instance[APPLICATION_CONTEXT];
    const methodMetadata = context.method.metadata;
    const isReactive = methodMetadata.isReactive();
    const tracker = appCtx.getInstance(ArgumentsTracker);
    const resource = appCtx.getInstance(ResourceType) as R;
    const dispose = tracker.track(args, args => {
        resource[EXECUTE](context, Array.from(args));
        if (!isReactive) {
            Promise.resolve().then(() => {
                dispose();
            });
        }
    });
    return resource;
}
