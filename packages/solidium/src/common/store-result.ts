import type { MemberKey } from "@vgerbot/ioc";
import { SignalMap } from "./SignalMap";

const RESULT_MAP = new SignalMap();

export function store(instance: object, methodName: MemberKey, value: unknown) {
	const [, set] = RESULT_MAP.get(instance, methodName);
	set(value);
}

export function clean(instance: object, methodName: MemberKey) {
	RESULT_MAP.delete(instance, methodName);
}

type MethodKeys<T> = {
	[K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];

type MethodReturnType<T, K extends MethodKeys<T>> = T[K] extends (
	...args: unknown[]
) => unknown
	? ReturnType<T[K]>
	: never;

export function resultOf<T>(
	instance: T,
	methodName: MethodKeys<T>,
): MethodReturnType<T, typeof methodName> {
	const [get] = RESULT_MAP.get(instance as object, methodName as MemberKey);
	return get() as MethodReturnType<T, typeof methodName>;
}
