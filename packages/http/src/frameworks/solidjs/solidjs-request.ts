import { Newable } from 'packages/ioc/dist';
import { APPLICATION_CONTEXT } from '../../core/EndpointMembers';
import { getExecutionContext } from '../../core/execution-context';
import { EXECUTE, Resource } from '../../resource/Resource';
import { ArgumentsTracker } from './ArgumentsTracker';
import { SolidReactiveState } from './SolidReactiveState';

export function solidjsRequest<T, R extends Resource<T>>(
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
                        SolidReactiveState
                    ) as SolidReactiveState<T>
            );
        });
        return resource;
    } else {
        const resource = new ResourceType();
        Reflect.set(resource, 'state', new SolidReactiveState());
        const dispose = tracker.track(args, args => {
            resource[EXECUTE](
                context,
                Array.from(args),
                () =>
                    appCtx.getInstance(
                        SolidReactiveState
                    ) as SolidReactiveState<T>
            );
            Promise.resolve().then(() => {
                dispose();
            });
        });
        return resource;
    }
}
