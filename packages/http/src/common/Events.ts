// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventListener = (...args: any[]) => void;
export class Events {
    private readonly listeners = new Map<string, Set<EventListener>>();
    on(event: string, listener: EventListener) {
        const wrappedListener = (...args: unknown[]) => {
            listener(...args);
        };
        const listeners = this.listeners.get(event) ?? new Set();
        listeners.add(wrappedListener);
        if (!this.listeners.has(event)) {
            this.listeners.set(event, listeners);
        }
        return () => {
            const listeners = this.listeners.get(event);
            if (listeners) {
                listeners.delete(wrappedListener);
            }
        };
    }
    emit(event: string, ...args: unknown[]) {
        this.listeners.get(event)?.forEach(listener => {
            listener(...args);
        });
    }
}
