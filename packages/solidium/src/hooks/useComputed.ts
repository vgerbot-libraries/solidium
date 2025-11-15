import { createMemo, createSignal, untrack } from 'solid-js';

const NOT_CHANGED_SYMBOL = Symbol('solidium-not-change-symbol');
/**
 * Creates a new memoized computation that is lazily evaluated.
 *
 * Unlike `createMemo` from `solid-js`, the computation function `fn` is not
 * executed until the returned getter is accessed for the first time. After the
 * initial access, it behaves like a standard memo, re-computing its value
 * only when its dependencies change.
 *
 * @param fn The computation function to be memoized. It should not take any
 *   arguments and should return a value of type T.
 * @returns A getter function that returns the memoized value. Accessing this
 *   getter tracks the computation in the current reactive context.
 *
 * @example
 * ```ts
 * const [count, setCount] = createSignal(0);
 * const doubleCount = useComputed(() => {
 *   console.log('Computing doubleCount...');
 *   return count() * 2;
 * });
 *
 * // At this point, 'Computing doubleCount...' has not been logged yet.
 *
 * console.log(doubleCount()); // Logs 'Computing doubleCount...' and then 0
 * console.log(doubleCount()); // Logs 0, no re-computation
 *
 * setCount(5);
 * console.log(doubleCount()); // Logs 'Computing doubleCount...' and then 10
 * ```
 */
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
