import { createStore, produce } from "solid-js/store";
import { defineClassDecoratorProcessor } from "../core/defineClassDecoratorProcessor";

export const SOLIDIUM_MARK_CLASS_STORE = Symbol("solidium-mark-class-store");

export const Store = () => {
	return defineClassDecoratorProcessor(SOLIDIUM_MARK_CLASS_STORE, {
		afterInstantiation(instance) {
			if (!instance || typeof instance !== "object") {
				return instance;
			}

			const [state, setState] = createStore(instance);
			const methodCache = new Map<string | symbol, Function>();
			const proto = Object.getPrototypeOf(instance);

			let currentDraft: object | null = null;

			function runInTransaction(
				fn: (this: object, ...args: unknown[]) => unknown,
				args: unknown[],
			) {
				if (currentDraft) {
					return fn.apply(currentDraft, args);
				}
				let result;
				setState(
					produce((draft) => {
						currentDraft = draft;
						try {
							result = fn.apply(draft, args);
						} finally {
							currentDraft = null;
						}
					}),
				);
				return result;
			}

			return new Proxy(instance, {
				get(_, key) {
					const originalMethod = proto[key];
					if (typeof originalMethod === "function") {
						if (methodCache.has(key)) {
							return methodCache.get(key);
						}
						const wrapped = (...args: unknown[]) =>
							runInTransaction(originalMethod, args);
						methodCache.set(key, wrapped);
						return wrapped;
					}
					const descriptor = Object.getOwnPropertyDescriptor(proto, key);
					if (descriptor?.get) {
						return descriptor.get.call(currentDraft ?? state);
					}
					return Reflect.get(currentDraft ?? state, key);
				},
			});
		},
	}) as ClassDecorator;
};
