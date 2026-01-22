import { createEffect, createRoot, getOwner } from "solid-js";
import { runWithSolidiumOwner } from "../core/owner";

export class Tracker {
	track(callback: (dispose: () => void) => void) {
		return runWithSolidiumOwner(this, () => {
			let dispose!: () => void;
			createRoot((_dispose) => {
				dispose = _dispose;
				createEffect(() => {
					callback(_dispose);
				});
			}, getOwner());
			return dispose;
		});
	}
	until(contition: () => boolean) {
		return new Promise<void>((resolve) => {
			this.track((dispose) => {
				if (contition()) {
					resolve();
					dispose();
				}
			});
		});
	}
}
