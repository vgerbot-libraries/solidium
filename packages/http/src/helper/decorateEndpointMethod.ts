/* eslint-disable @typescript-eslint/no-explicit-any */
import { EndpointMetadata } from "../metadata/EndpointMetadata";
import type { RequestMethodMetadata } from "../metadata/RequestMethodMetadata";

export function decorateEndpointMethod(
	decorator: (
		clazz: Function,
		methodName: string | symbol,
		methodMetadata: RequestMethodMetadata,
		// biome-ignore lint/suspicious/noConfusingVoidType: void
	) => TypedPropertyDescriptor<(...args: any[]) => any> | void,
) {
	return function decorateMethod<
		R = any,
		A extends Array<any> = Array<any>,
		T extends (...args: any[]) => any = (...args: A) => R,
	>(
		target: unknown,
		context: ClassMethodDecoratorContext<object, T> | string | symbol,
		descriptor?: TypedPropertyDescriptor<T>,
	) {
		if (typeof target === "function" && typeof context === "object") {
			const propertyKey = context.name;
			context.addInitializer(function () {
				const clazz = this.constructor;
				const method =
					EndpointMetadata.from(clazz).getMethodMetadata(propertyKey);
				const descriptor = decorator(clazz, propertyKey, method);
				if (descriptor) {
					Reflect.set(this, propertyKey, descriptor.value);
				}
			});
		} else if (
			typeof target === "object" &&
			typeof context !== "object" &&
			typeof descriptor === "object"
		) {
			const propertyKey = context;
			const clazz = (target as object).constructor;
			const method =
				EndpointMetadata.from(clazz).getMethodMetadata(propertyKey);
			const descriptor = decorator(clazz, propertyKey, method);
			return descriptor;
		}
	};
}
