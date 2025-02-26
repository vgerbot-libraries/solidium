import { APPLICATION_CONTEXT } from '../../core/EndpointMembers';
import { getExecutionContext } from '../../core/execution-context';
import { EXECUTE } from '../../resource/Resource';
import { SolidiumArrayBufferResource } from './SolidiumDownloadResource';

export function arraybuffer(...args: unknown[]) {
    const context = getExecutionContext();
    if (!context) {
        throw new Error('');
    }
    const appCtx = context.instance[APPLICATION_CONTEXT];
    const resource = appCtx.getInstance(
        SolidiumArrayBufferResource
    ) as SolidiumArrayBufferResource;
    resource[EXECUTE](Array.from(args));
    return resource;
}
