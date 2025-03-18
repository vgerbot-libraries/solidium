import { InstanceScope, Scope } from '@vgerbot/ioc';
import { Resource } from './Resource';

import { isTextEventStream } from '../common/mime-utils';
import { HttpResponse } from '../core/HttpResponse';

@Scope(InstanceScope.TRANSIENT)
export class JSONSSEResource<T> extends Resource<T> {
    protected async *resolveResponseBody(
        response: HttpResponse
    ): AsyncGenerator<unknown, void, unknown> {
        const headers = await response.headers();
        const contentType = headers.get('content-type')?.join(', ');
        if (isTextEventStream(contentType)) {
            yield* response.jsonStream();
        } else {
            yield* super.resolveResponseBody(response);
        }
    }
}
