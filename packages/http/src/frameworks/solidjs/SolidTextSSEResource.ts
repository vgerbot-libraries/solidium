import { Inject, InstanceScope, Scope } from '@vgerbot/ioc';
import { Resource } from '../../resource/Resource';
import { ResourceStatus } from '../../resource/ResourceStatus';

import { HttpResponse } from '../../core/HttpResponse';
import { ResourceError } from '../../resource/ResourceError';
import { SolidReactiveState } from './SolidReactiveState';

@Scope(InstanceScope.TRANSIENT)
export class SolidTextSSEResource extends Resource<string> {
    @Inject()
    protected state!: SolidReactiveState<string>;
    protected async handleResponse(response: HttpResponse): Promise<void> {
        try {
            for await (const data of response.textStream()) {
                this.state.appendMessage(data);
            }
        } catch (error) {
            // Re-wrap other errors in ResourceError
            this.status = ResourceStatus.ERROR;
            this.state.error = new ResourceError(error);
            throw error;
        }
    }
    protected async handleHttpErrorResponse(
        response: HttpResponse
    ): Promise<void> {
        const httpStatus = await response.status();
        // Create generic HTTP status error
        const httpError = new Error(`HTTP Error ${httpStatus}`);
        this.status = ResourceStatus.ERROR;
        this.state.error = new ResourceError(httpError);
        throw httpError;
    }
}
