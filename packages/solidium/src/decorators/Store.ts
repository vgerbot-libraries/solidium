import { defineClassDecoratorProcessor } from "../core/defineClassDecoratorProcessor";
import { createDefferedStore } from "../helper/createDefferedStore";

export const SOLIDIUM_MARK_CLASS_STORE = Symbol("solidium-mark-class-store");

export const Store = () => {
	return defineClassDecoratorProcessor(SOLIDIUM_MARK_CLASS_STORE, {
		afterInstantiation(instance) {
			if (!instance || typeof instance !== "object") {
				return instance;
			}
			return createDefferedStore(instance as object);
		},
	}) as ClassDecorator;
};
