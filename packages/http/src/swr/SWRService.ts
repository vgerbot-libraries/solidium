import { ResourceExecutionState } from '../resource/ResourceExecutionState';
import { SWRConfig } from './SWRConfig';
import { SWRInstance } from './SWRInstance';

export class SWRService {
    private readonly instances: Map<
        string,
        SWRInstance<ResourceExecutionState<unknown, unknown>>
    > = new Map();
    obtainInstance(key: string) {
        return this.instances.get(key);
    }
    useSWR(
        keygen: () => string,
        fetcher: (
            key: string
        ) => Promise<ResourceExecutionState<unknown, unknown>>,
        config: SWRConfig
    ) {
        const key = keygen();
        if (!this.instances.has(key)) {
            const instance = new SWRInstance<
                ResourceExecutionState<unknown, unknown>
            >(key, fetcher, config);
            this.instances.set(
                key,
                instance as unknown as SWRInstance<
                    ResourceExecutionState<unknown, unknown>
                >
            );
            instance.mutate();
            return instance;
        } else {
            return this.instances.get(key) as SWRInstance<
                ResourceExecutionState<unknown, unknown>
            >;
        }
    }
}
