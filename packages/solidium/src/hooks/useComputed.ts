import { createMemo, getOwner, runWithOwner } from "solid-js";

export interface ComputedOptions<T> {
	equals?: false | ((prev: T, next: T) => boolean);
}
/**
 * Creates a lazily initialized memoized computation.
 *
 * Unlike `createMemo` from `solid-js`, `fn` is not executed until the returned
 * getter is accessed for the first time. After initialization, it behaves like
 * a normal memo and updates only when its dependencies change.
 *
 * @param fn The computation function to memoize.
 * @param options Optional memo options passed through to the internal
 *   `createMemo` call, such as `equals`.
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
export function useComputed<T>(fn: () => T, options?: ComputedOptions<T>) {
	const owner = getOwner();
	let read = () => {
		const memo = runWithOwner(owner, () => {
			return createMemo(fn, options);
		})!;
		read = memo;
		return memo();
	};
	return () => read();
}
