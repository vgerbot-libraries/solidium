import { Mark } from "@vgerbot/ioc";
import {
	type ClassDecoratorProcessor,
	IS_CLASS_DECORATOR_PROCESSOR,
} from "./DecoratorProcessor";

export function defineClassDecoratorProcessor<T>(
	key: string | symbol,
	processor: Omit<
		ClassDecoratorProcessor<T>,
		typeof IS_CLASS_DECORATOR_PROCESSOR
	>,
) {
	return Mark(key, {
		[IS_CLASS_DECORATOR_PROCESSOR]: true,
		...processor,
	}) as ClassDecorator;
}
