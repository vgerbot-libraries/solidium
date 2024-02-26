import {
    ApplicationContext,
    ClassMetadata,
    InstanceScope,
    Newable
} from '@vgerbot/ioc';
import { ParentProps, createContext, createRoot } from 'solid-js';
import { afterInstantiation, beforeInstantiation } from './processor';
import { Identifier } from '@vgerbot/ioc/dist/types/Identifier';

export const IoCContext = createContext<ApplicationContext>();

export type SolidiumProps = ParentProps<{
    init?: (appCtx: ApplicationContext) => void;
    autoRegisterClasses?: Array<Newable<unknown>>;
}>;

class ServiceInstanceStatusManager {
    private store = new WeakMap<Newable<unknown>, true>();
    record<T>(cls: Newable<T>) {
        this.store.set(cls, true);
    }
    isInstantiated<T>(cls: Newable<T>) {
        return this.store.has(cls);
    }
}

export function Solidium(props: SolidiumProps) {
    const appCtx = new ApplicationContext();
    const manager = appCtx.getInstance(ServiceInstanceStatusManager);
    const originGetInstance = appCtx.getInstance;
    appCtx.getInstance = function <T, O>(
        this: ApplicationContext,
        id: Identifier,
        owner?: O
    ): T {
        if (typeof id === 'function') {
            const metadata = ClassMetadata.getInstance(id).reader();
            if (metadata.getScope() === InstanceScope.TRANSIENT) {
                return originGetInstance.call(this, id, owner) as T;
            }
            if (manager.isInstantiated(id)) {
                return originGetInstance.call(this, id, owner) as T;
            }
        }
        const [dispose, instance] = createRoot(dispose => {
            return [dispose, originGetInstance.call(this, id, owner)];
        });
        this.onPreDestroy(() => {
            queueMicrotask(dispose);
        });
        return instance as T;
    };
    appCtx.registerBeforeInstantiationProcessor(beforeInstantiation);
    appCtx.registerAfterInstantiationProcessor(afterInstantiation);
    if (typeof props.init === 'function') {
        props.init(appCtx);
    }
    props.autoRegisterClasses?.forEach(cls => {
        appCtx.getInstance(cls);
    });
    return (
        <IoCContext.Provider value={appCtx}>
            {props.children}
        </IoCContext.Provider>
    );
}
