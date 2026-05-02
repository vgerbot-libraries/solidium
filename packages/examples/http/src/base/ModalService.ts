import { Defer } from "@vgerbot/http";
import { Inject } from "@vgerbot/ioc";
import { Tracker } from "@vgerbot/solidium";

export class ModalService {
	private lastPromise = Promise.resolve();
	@Inject()
	private tracker!: Tracker;

	async takeUntil(that: () => boolean) {
		const defer = new Defer<void>();
		const lastPromise = this.lastPromise;
		this.lastPromise = this.lastPromise.finally(() => defer.promise);
		await lastPromise;

		if (that()) {
			defer.resolve();
			return defer.promise;
		}

		this.tracker.track((dispose) => {
			if (that()) {
				dispose();
				defer.resolve();
			}
		});

		return defer.promise;
	}
}
