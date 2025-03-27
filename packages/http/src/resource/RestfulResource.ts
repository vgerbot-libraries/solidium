import { Inject, InstanceScope, Scope } from '@vgerbot/ioc';
import { lastValueFrom } from 'rxjs';
import { SWRDecoratorConfig } from '../swr/SWR';
import { ExecutionContext } from '../core/execution-context';
import {
    EXTRA_METADATA_MUTATE,
    EXTRA_METADATA_SWR_CONFIG,
    EXTRA_METADATA_SWR_KEYGEN
} from '../swr/consts';
import { SWRService } from '../swr/SWRService';
import { EXECUTE, Resource } from './Resource';
import { ResourceExecutionState } from './ResourceExecutionState';
import { SWRConfig } from '../swr/SWRConfig';

@Scope(InstanceScope.TRANSIENT)
export class RestfulResource<T, E = unknown> extends Resource<T, E> {
    @Inject()
    private swrService!: SWRService;
    protected [EXECUTE](context: ExecutionContext, args: unknown[]) {
        const methodMetadata = context.method.metadata;
        const _keygen = methodMetadata.getExtra<
            string | ((...args: unknown[]) => string) | undefined
        >(EXTRA_METADATA_SWR_KEYGEN);

        const mutate =
            methodMetadata.getExtra<boolean>(EXTRA_METADATA_MUTATE) ?? false;

        const swrConfig = methodMetadata.getExtra<
            SWRDecoratorConfig | undefined
        >(EXTRA_METADATA_SWR_CONFIG);

        if (mutate && swrConfig) {
            throw new Error('@SWR and @Mutate cannot be used together');
        }

        if (!swrConfig) {
            return super[EXECUTE](context, args);
        }
        const keygen = () => {
            if (typeof _keygen === 'string') {
                return _keygen;
            }
            if (typeof _keygen === 'function') {
                return _keygen(...args);
            }
            return context.method.resolveURL(context.params);
        };

        const instance = this.swrService.useSWR(
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
            swrConfig as SWRConfig
        );
        instance?.onStateChange(state => {
            this.state = state.data as ResourceExecutionState<T, E>;
        });
    }
}
