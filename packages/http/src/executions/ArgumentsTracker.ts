import { debounce, leading } from "@solid-primitives/scheduled";
import { runWithSolidiumOwner } from "@vgerbot/solidium";
import {
	type AccessorArray,
	createEffect,
	createRoot,
	getOwner,
	on,
} from "solid-js";

export class ArgumentsTracker {
	track(args: unknown[], callback: (args: unknown[]) => void) {
		const hasAccessor = !!args.find((it) => typeof it === "function");
		if (!hasAccessor) {
			callback(args);
			return () => {};
		}
		return runWithSolidiumOwner(this, () => {
			const owner = getOwner();
			let _dispose = () => {};
			createRoot((dispose) => {
				_dispose = dispose;
				const trigger = leading(debounce, (resolvedArgs: unknown[]) => {
					for (let i = 0; i < args.length; i++) {
						if (typeof args[i] === "function") {
							if (resolvedArgs[i] === null || resolvedArgs[i] === undefined) {
								return;
							}
						}
					}
					callback(resolvedArgs);
				});
				createEffect(
					on(
						args.map((it) => {
							if (typeof it === "function") {
								return it;
							}
							return () => it;
						}) as AccessorArray<unknown>,
						trigger,
					),
				);
			}, owner);
			return () => {
				_dispose();
			};
		});
	}
}
