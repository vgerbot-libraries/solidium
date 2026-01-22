import { Mark } from "@vgerbot/ioc";
import {
	IS_MEMBER_DECORATOR_PROCESSOR,
	type MemberDecoratorProcessor,
} from "./DecoratorProcessor";

export function defineMemberDecoratorProcessor<T>(
	key: string | symbol,
	processor: Omit<
		MemberDecoratorProcessor<T>,
		typeof IS_MEMBER_DECORATOR_PROCESSOR
	>,
) {
	return Mark(key, {
		[IS_MEMBER_DECORATOR_PROCESSOR]: true,
		...processor,
	}) as PropertyDecorator;
}
