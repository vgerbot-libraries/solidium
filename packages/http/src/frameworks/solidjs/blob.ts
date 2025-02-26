import { APPLICATION_CONTEXT } from '../../core/EndpointMembers';
import { getExecutionContext } from '../../core/execution-context';
import { EXECUTE } from '../../resource/Resource';
import { SolidiumBlobResource } from './SolidiumDownloadResource';

export function blob(...args: unknown[]) {
    const context = getExecutionContext();
    if (!context) {
        throw new Error('');
    }
    const appCtx = context.instance[APPLICATION_CONTEXT];
    const resource = appCtx.getInstance(
        SolidiumBlobResource
    ) as SolidiumBlobResource;
    resource[EXECUTE](Array.from(args));
    return resource;
}
