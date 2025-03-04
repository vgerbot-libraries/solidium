export interface StorageLoadEvent<T, D = unknown> {
    instance: T;
    member: PropertyKey;
    value: D;
    loadedMembers: Set<PropertyKey>;
    timestamp: number;
}
export type InternalStorageLoadEvent<T> = Omit<
    StorageLoadEvent<T>,
    'loadedMembers'
>;
export type StorageLoadEventListener = <T>(event: StorageLoadEvent<T>) => void;
export type InternalStorageLoadEventListener = <T>(
    event: InternalStorageLoadEvent<T>
) => void;

const STORAGE_LOAD_EVENTS = Symbol();

export function notifyStorageLoad<T>(event: InternalStorageLoadEvent<T>) {
    const prototype = Object.getPrototypeOf(event.instance);
    const events: InternalStorageLoadEventListener[] =
        Reflect.getMetadata(STORAGE_LOAD_EVENTS, prototype) ?? [];
    events.forEach(handle => {
        handle.call(event.instance, event);
    });
}

export interface StorageLoadNotifyOptions {
    members: PropertyKey[];
}

export function StorageLoadNotify(options?: StorageLoadNotifyOptions) {
    return <T extends object>(target: T, propertyKey: PropertyKey) => {
        const events: InternalStorageLoadEventListener[] =
            Reflect.getMetadata(STORAGE_LOAD_EVENTS, target) ?? [];
        Reflect.defineMetadata(STORAGE_LOAD_EVENTS, events, target);

        const loadedMembers = new Set<PropertyKey>();
        events.push(function listener<T>(
            this: T,
            event: InternalStorageLoadEvent<T>
        ) {
            loadedMembers.add(event.member);
            if (options?.members && !options.members.includes(event.member)) {
                return;
            }
            const method = Reflect.get(
                this as object,
                propertyKey
            ) as StorageLoadEventListener;
            method.call(this, {
                ...event,
                loadedMembers: new Set(loadedMembers)
            });
            if (options?.members) {
                const isAllHandled = loadedMembers.isSupersetOf(
                    new Set(options.members)
                );
                if (isAllHandled) {
                    const index = events.indexOf(listener);
                    if (index === -1) {
                        return;
                    }
                    const newEvents = events.slice(0).splice(index, 1);
                    Reflect.defineMetadata(
                        STORAGE_LOAD_EVENTS,
                        newEvents,
                        target
                    );
                }
            }
        });
    };
}
