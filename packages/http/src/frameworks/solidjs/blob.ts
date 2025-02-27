import { APPLICATION_CONTEXT } from '../../core/EndpointMembers';
import { getExecutionContext } from '../../core/execution-context';
import { EXECUTE } from '../../resource/Resource';
import { SolidiumBlobResource } from './SolidiumDownloadResource';
import { Tracker } from './Tracker';

export function blob(...args: unknown[]) {
    const context = getExecutionContext();
    if (!context) {
        throw new Error('');
    }
    const appCtx = context.instance[APPLICATION_CONTEXT];
    const resource = appCtx.getInstance(
        SolidiumBlobResource
    ) as SolidiumBlobResource;

    const tracker = appCtx.getInstance(Tracker);
    tracker.track(args, args => {
        resource[EXECUTE](args);
    });
    return resource;
}
