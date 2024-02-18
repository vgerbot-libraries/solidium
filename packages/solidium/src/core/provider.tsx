import { ApplicationContext, Newable } from '@vgerbot/ioc';
import { ParentProps, createContext, createEffect, createRoot } from 'solid-js';
import { afterInstantiation, beforeInstantiation } from './processor';
import { SolidiumPlugin } from './SolidiumPlugin';

export const IoCContext = createContext<ApplicationContext>();

export type SolidiumProps = ParentProps<{
    init?: (appCtx: ApplicationContext) => void;
    plugins?: Array<Newable<SolidiumPlugin>>;
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
    appCtx.getInstance = function <T>(
        this: ApplicationContext,
        cls: Newable<T>
    ): T {
        if (manager.isInstantiated(cls)) {
            return originGetInstance.call(this, cls) as T;
        } else {
            const [dispose, instance] = createRoot(dispose => {
                return [dispose, originGetInstance.call(this, cls)];
            });
            this.onPreDestroy(() => {
                queueMicrotask(dispose);
            });
            return instance as T;
        }
    };
    appCtx.registerBeforeInstantiationProcessor(beforeInstantiation);
    appCtx.registerAfterInstantiationProcessor(afterInstantiation);
    if (typeof props.init === 'function') {
        props.init(appCtx);
    }
    const plugins: SolidiumPlugin[] = [];
    if (Array.isArray(props.plugins)) {
        props.plugins.forEach(pluginClass => {
            const pluginInstance = appCtx.getInstance(pluginClass);
            plugins.push(pluginInstance);
            pluginInstance.init(appCtx);
        });
    }
    createEffect(
        appCtx.onPreDestroy(() => {
            plugins.forEach(pluginInstance => pluginInstance.destroy());
        })
    );
    return (
        <IoCContext.Provider value={appCtx}>
            {props.children}
        </IoCContext.Provider>
    );
}
