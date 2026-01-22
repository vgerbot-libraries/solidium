import {
	ApplicationContext,
	type Identifier,
	type Newable,
} from "@vgerbot/ioc";
import {
	createContext,
	createRoot,
	getOwner,
	type Owner,
	type ParentProps,
} from "solid-js";
import { createComponent } from "solid-js/web";
import { COMPONENT_TREE_SCOPE } from "../decorators/ComponentTreeScope";
import { ComponentTreeScopeInstanceResolution } from "../ioc/ScopedInstanceResolution";
import { setupOwner } from "./owner";
import { afterInstantiation, beforeInstantiation } from "./processor";

export const IoCContext = createContext<ApplicationContext>();

export type SolidiumProps = ParentProps<{
	init?: (appCtx: ApplicationContext) => void;
	autoRegisterClasses?: Array<Newable<unknown>>;
}>;

export function Solidium(props: SolidiumProps) {
	const owner = getOwner();
	const appCtx = new ApplicationContext();
	const IS_MANAGED = Symbol("IS_MANAGED");
	const originGetInstance = appCtx.getInstance;
	appCtx.getInstance = function <T, O>(
		this: ApplicationContext,
		id: Identifier,
		instanceOwner?: O,
	): T {
		const [dispose, instance] = createRoot((dispose) => {
			return [dispose, originGetInstance.call(this, id, instanceOwner)];
		}, owner);
		if (instance !== null && typeof instance === "object") {
			const isManaged = Reflect.getMetadata(IS_MANAGED, instance) as boolean;
			if (isManaged) {
				dispose();
			} else {
				Reflect.defineMetadata(IS_MANAGED, true, instance);
			}
			const removeListener = this.onPreDestroyThat((it) => {
				if (it === instance) {
					dispose();
					removeListener();
				}
			});
		}
		return instance as T;
	};

	appCtx.registerBeforeInstantiationProcessor(<T>(constructor: Newable<T>) => {
		beforeInstantiation(constructor, appCtx);
		return undefined;
	});
	appCtx.registerAfterInstantiationProcessor(
		<T extends object>(instance: T) => {
			setupOwner(instance, owner as Owner);
			return instance;
		},
	);
	appCtx.registerAfterInstantiationProcessor(<T extends object>(instance: T) =>
		afterInstantiation(instance, appCtx),
	);
	appCtx.registerInstanceScopeResolution(
		COMPONENT_TREE_SCOPE,
		ComponentTreeScopeInstanceResolution,
	);
	if (typeof props.init === "function") {
		props.init(appCtx);
	}
	props.autoRegisterClasses?.forEach((cls) => {
		appCtx.getInstance(cls);
	});
	return createComponent(IoCContext.Provider, {
		value: appCtx,
		get children() {
			return props.children;
		},
	});
}
