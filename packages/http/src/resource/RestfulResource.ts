import { Inject, InstanceScope, Scope } from '@vgerbot/ioc';
import { EXECUTE, Resource } from './Resource';
import { ExecutionContext } from '../core/execution-context';
import { ResourceExecutionState } from './ResourceExecutionState';
import { SWRService } from '../swr/SWRService';
import { SWR_CONFIG_EXTRA_KEY } from '../swr/consts';
import { SWRConfig } from '../swr/SWRConfig';
import { lastValueFrom } from 'rxjs';

@Scope(InstanceScope.TRANSIENT)
export class RestfulResource<T, E = unknown> extends Resource<T, E> {
    @Inject()
    private swrService!: SWRService;
    protected [EXECUTE](context: ExecutionContext, args: unknown[]) {
        const methodMetadata = context.method.metadata;
        const swrConfig = methodMetadata.getExtra<SWRConfig | undefined>(
            SWR_CONFIG_EXTRA_KEY
        );
        if (!swrConfig) {
            return super[EXECUTE](context, args);
        }
        const keygen = () => {
            return context.method.resolveURL(context.params);
        };

        this.swrService.useSWR(
            keygen,
            () => {
                const state = this.ioc.getInstance(
                    ResourceExecutionState
                ) as ResourceExecutionState<T, E>;
                super[EXECUTE](context, args, state);
                return lastValueFrom(state).then(
                    () => state as ResourceExecutionState<unknown, unknown>
                );
            },
            swrConfig
        );
        const instance = this.swrService.obtainInstance(keygen());
        instance?.onStateChange(state => {
            this.state = state.data as ResourceExecutionState<T, E>;
        });
    }
}
