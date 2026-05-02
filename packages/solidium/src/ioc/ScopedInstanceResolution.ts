import type { Identifier } from "@vgerbot/ioc";
import {
	ClassMetadata,
	type GetInstanceOptions,
	type InstanceResolution,
	Lifecycle,
	type Newable,
	type SaveInstanceOptions,
} from "@vgerbot/ioc";
import { getOwner, type Owner, onCleanup, runWithOwner } from "solid-js";
import { InstanceWrapper } from "./InstanceWrapper";

interface SolidiumOwner extends Owner {
	instances?: Map<Identifier, InstanceWrapper>;
}
type AnyInstanceType = {
	[key: string | symbol]: unknown;
};
export class ComponentTreeScopeInstanceResolution
	implements InstanceResolution
{
	private allInstances: InstanceWrapper[] = [];
	shouldGenerate<T, Owner>(options: GetInstanceOptions<T, Owner>): boolean {
		const solidOwner = this.getParentSolidOwner(options.identifier);
		return !solidOwner;
	}
	saveInstance<T, Owner>(options: SaveInstanceOptions<T, Owner>): void {
		const owner = getOwner() as SolidiumOwner | null | undefined;
		if (!owner) {
			return;
		}
		if (!owner.instances) {
			owner.instances = new Map();
		}
		const wrapper = new InstanceWrapper(options.instance);
		this.allInstances.push(wrapper);
		owner.instances.set(options.identifier, wrapper);
		runWithOwner(owner, () => {
			onCleanup(() => {
				this.invokeInstancePreDestroy(wrapper.instance as AnyInstanceType);
				const index = this.allInstances.indexOf(wrapper);
				if (index > -1) {
					this.allInstances.splice(index, 1);
				}
			});
		});
	}
	getInstance<T, Owner>(options: GetInstanceOptions<T, Owner>): T | undefined {
		const solidOwner = this.getParentSolidOwner(options.identifier);
		if (!solidOwner) {
			return;
		}
		return solidOwner.instances?.get(options.identifier)?.instance as
			| T
			| undefined;
	}
	destroy(): void {
		this.allInstances.sort((a, b) => a.compareTo(b));
		this.allInstances.forEach((wrapper) => {
			this.invokeInstancePreDestroy(wrapper.instance as AnyInstanceType);
		});
		this.allInstances.length = 0;
	}
	private invokeInstancePreDestroy(instance: AnyInstanceType) {
		const classMetadata = ClassMetadata.getInstance(
			instance.constructor as Newable<unknown>,
		);
		const preDestroyMethods = classMetadata.getMethods(Lifecycle.PRE_DESTROY);
		preDestroyMethods.forEach((methodName) => {
			const method = instance[methodName];
			if (typeof method === "function") {
				method.call(instance);
			}
		});
	}
	private getParentSolidOwner(identifier: Identifier) {
		let owner = getOwner() as SolidiumOwner | null | undefined;
		while (!!owner && !!owner.instances) {
			const hasInstance = owner.instances.has(identifier);
			if (hasInstance) {
				return owner;
			}
			owner = owner.owner?.owner;
		}
		return owner;
	}
}
