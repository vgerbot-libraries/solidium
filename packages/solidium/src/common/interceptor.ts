export type SetterInterceptorFunction<T> = (
	this: T,
	oldValue: unknown,
	newValue: unknown,
) => unknown;

export function combineSetterInterceptor<T>(
	before: SetterInterceptorFunction<T> | undefined,
	after: SetterInterceptorFunction<T>,
): SetterInterceptorFunction<T> {
	if (typeof before !== "function") {
		return after;
	}
	return function (this: T, oldValue: unknown, newValue: unknown) {
		return after.call(this, oldValue, before.call(this, oldValue, newValue));
	};
}
