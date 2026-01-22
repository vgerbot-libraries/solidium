import { InstanceScope, Scope } from "@vgerbot/ioc";
import { Signal } from "@vgerbot/solidium";
import type { HttpResponse } from "../core/HttpResponse";
import type { ByteStream } from "../http/ByteStream";
import type { Progress } from "../progress/Progress";
import { ProgressiveResource } from "./ProgressiveResource";
import type { ResourceExecutionState } from "./ResourceExecutionState";

@Scope(InstanceScope.TRANSIENT)
export class DownloadResource extends ProgressiveResource<ByteStream> {
	@Signal()
	public progress!: Progress;

	protected async handleResponse(
		response: HttpResponse,
		state: ResourceExecutionState<ByteStream, unknown>,
	): Promise<void> {
		// Set up progress tracking
		response.onDownload((progress) => {
			this.updateProgress(progress);
		});

		return super.handleResponse(response, state);
	}

	protected updateProgress(progress: Progress): void {
		this.progress = progress;
	}
	protected async *resolveResponseBody(
		response: HttpResponse,
	): AsyncGenerator<ByteStream, void, unknown> {
		yield response.body();
	}
}
