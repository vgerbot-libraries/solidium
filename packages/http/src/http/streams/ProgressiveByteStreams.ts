import { Events } from "../../common/Events";
import type { Progress } from "../../progress/Progress";
import type { ProgressHandler } from "../../progress/ProgressHandler";
import type { ByteStream } from "../ByteStream";

export abstract class ProgressiveByteStream implements ByteStream {
	private readonly events = new Events();
	abstract total(): Promise<number>;
	onProgress(handler: ProgressHandler): () => void {
		return this.events.on("progress", handler);
	}
	protected updateProgress(progress: Progress) {
		this.events.emit("progress", progress);
	}
	abstract readAsBuffer(): Promise<ArrayBuffer>;
	abstract readAsStream(): ReadableStream<ArrayBuffer>;
	abstract readAsBlob(contentType?: string): Promise<Blob>;
}
