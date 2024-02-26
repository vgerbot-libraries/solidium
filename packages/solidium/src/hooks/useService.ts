import { ClassMetadata, InstanceScope, Newable } from '@vgerbot/ioc';
import { useApplicationContext } from './useIoC';
import { onCleanup } from 'solid-js';

export function useService<T>(cls: Newable<T>): T {
    const context = useApplicationContext();
    const instance = context.getInstance(cls);
    const metadata = ClassMetadata.getInstance(cls).reader();
    const scope = metadata.getScope();
    if (scope === InstanceScope.TRANSIENT) {
        onCleanup(() => {
            context.destroyTransientInstance(instance);
        });
    }
    return instance;
}
