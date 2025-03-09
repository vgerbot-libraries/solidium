import { Inject, InstanceScope, Scope } from '@vgerbot/ioc';
import { Resource } from '../../resource/Resource';

import { isTextEventStream } from '../../common/mime-utils';
import { HttpResponse } from '../../core/HttpResponse';
import { SolidReactiveState } from './SolidReactiveState';

@Scope(InstanceScope.TRANSIENT)
export class SolidTextSSEResource extends Resource<string> {
    @Inject()
    protected state!: SolidReactiveState<string>;

    protected async *resolveResponseBody(
        response: HttpResponse
    ): AsyncGenerator<unknown, void, unknown> {
        const headers = await response.headers();
        const contentType = headers.get('content-type')?.join(', ');
        if (isTextEventStream(contentType)) {
            yield* response.textStream();
        } else {
            yield* super.resolveResponseBody(response);
        }
    }
}
