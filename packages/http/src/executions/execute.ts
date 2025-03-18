import { Newable } from 'packages/ioc/dist';
import { APPLICATION_CONTEXT } from '../core/EndpointMembers';
import { getExecutionContext } from '../core/execution-context';
import { EXECUTE, Resource } from '../resource/Resource';
import { ArgumentsTracker } from './ArgumentsTracker';
import { ResourceExecutionState } from '../resource/ResourceExecutionState';

export function execute<T, R extends Resource<T>>(
    args: unknown[],
    ResourceType: Newable<R>
) {
    const context = getExecutionContext();
    if (!context) {
        throw new Error('Unknown error!');
    }
    const appCtx = context.instance[APPLICATION_CONTEXT];
    const isReactive = context.method.isReactive();
    const tracker = appCtx.getInstance(ArgumentsTracker);
    if (isReactive) {
        const resource = appCtx.getInstance(ResourceType) as R;
        tracker.track(args, args => {
            resource[EXECUTE](
                context,
                Array.from(args),
                () =>
                    appCtx.getInstance(
                        ResourceExecutionState
                    ) as ResourceExecutionState<T>
            );
        });
        return resource;
    } else {
        const resource = new ResourceType();
        Reflect.set(resource, 'state', new ResourceExecutionState());
        const dispose = tracker.track(args, args => {
            resource[EXECUTE](
                context,
                Array.from(args),
                () =>
                    appCtx.getInstance(
                        ResourceExecutionState
                    ) as ResourceExecutionState<T>
            );
            Promise.resolve().then(() => {
                dispose();
            });
        });
        return resource;
    }
}
