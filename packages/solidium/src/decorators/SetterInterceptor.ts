import type { MemberKey, Newable } from "@vgerbot/ioc";
import { defineMemberDecoratorProcessor } from "../core/defineMemberDecoratorProcessor";
import {
	appendSetterInterceptor,
	type SetterInterceptorOptions,
} from "../helper/appendSetterInterceptor";

export const SETTER_INTERCEPTOR_METHOD_MARK_KEY = Symbol(
	"solidium_setter_interceptor_method",
);

export const SetterInterceptor = (
	options: string | symbol | SetterInterceptorOptions,
) => {
	switch (typeof options) {
		case "string":
		case "symbol":
			options = {
				key: options,
			};
			break;
		default:
	}
	return defineMemberDecoratorProcessor(SETTER_INTERCEPTOR_METHOD_MARK_KEY, {
		beforeInstantiation: <T>(constructor: Newable<T>, member: MemberKey) => {
			appendSetterInterceptor(constructor.prototype, options, member);
		},
	}) as MethodDecorator;
};
