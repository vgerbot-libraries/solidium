import { createMemo, createSignal, untrack } from 'solid-js';

const NOT_CHANGED_SYMBOL = Symbol('solidium-not-change-symbol');

export function useComputed<T>(fn: () => T) {
    const [get, emitChange] = createSignal<symbol | unknown>(
        NOT_CHANGED_SYMBOL
    );

    const getter = createMemo(() => {
        const v = get();
        if (v != NOT_CHANGED_SYMBOL) {
            return fn();
        }
        return NOT_CHANGED_SYMBOL;
    });
    return function () {
        if (untrack(get) == NOT_CHANGED_SYMBOL) {
            emitChange(null);
        }
        return getter();
    };
}
