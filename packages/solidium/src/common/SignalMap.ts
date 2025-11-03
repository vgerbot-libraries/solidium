import { Signal, createSignal } from 'solid-js';

export class SignalMap {
    private readonly store = new WeakMap<
        object,
        Map<string | number | symbol, Signal<unknown>>
    >();
    get(
        object: object,
        key: string | number | symbol,
        initValue?: unknown
    ): Signal<unknown> {
        if (object === null || typeof object !== 'object') {
            throw new Error('');
        }
        let signalMap = this.store.get(object);
        if (!signalMap) {
            this.store.set(object, (signalMap = new Map()));
        }
        let signal = signalMap.get(key);
        if (!signal) {
            signalMap.set(key, (signal = createSignal(initValue)));
        }
        return signal;
    }
    delete(object: object, key: string | number | symbol) {
        const signalMap = this.store.get(object);
        if (signalMap) {
            signalMap.delete(key);
        }
    }
    has(object: object, key: string | number | symbol) {
        if (!this.store.has(object)) {
            return false;
        }
        const signalMap = this.store.get(object);
        if (!signalMap?.has(key)) {
            return false;
        }
        return true;
    }
}
