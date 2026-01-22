import { Signal } from "@vgerbot/solidium";
import { Progress } from "../progress/Progress";
import { Resource } from "./Resource";

export abstract class ProgressiveResource<T, E = unknown> extends Resource<
	T,
	E
> {
	@Signal()
	progress: Progress = new Progress(0, 0);

	protected updateProgress(progress: Progress): void {
		this.progress = progress;
	}
}
