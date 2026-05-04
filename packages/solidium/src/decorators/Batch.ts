import type { MemberKey } from "@vgerbot/ioc";
import { batch } from "solid-js";
import { defineMemberDecoratorProcessor } from "../core/defineMemberDecoratorProcessor";

export const BATCH_METHOD_MARK_KEY = Symbol("solidium-batch-method-mark-key");

type HasMethod = {
	[member: MemberKey]: Function | undefined;
};

export const Batch = () =>
	defineMemberDecoratorProcessor<HasMethod>(BATCH_METHOD_MARK_KEY, {
		afterInstantiation(instance, member) {
			const origin = (instance as HasMethod)[member];
			if (typeof origin !== "function") {
				return;
			}
			const batchFn = batch((...args) => {
				return origin.apply(instance, args);
			});
			Object.defineProperty(instance, member, {
				enumerable: false,
				writable: true,
				value: batchFn,
			});
		},
	}) as MethodDecorator;
