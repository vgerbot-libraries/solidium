import { createProgressiveReadableStream } from "../../common/createProgressiveReadableStream";
import { Progress } from "../../progress/Progress";
import type { ByteStream } from "../ByteStream";
import { ProgressiveByteStream } from "./ProgressiveByteStreams";

export class BlobByteStream
	extends ProgressiveByteStream
	implements ByteStream
{
	constructor(private readonly blob: Blob) {
		super();
	}
	readAsStream(): ReadableStream<ArrayBuffer> {
		const total = this.blob.size;
		return createProgressiveReadableStream(this.blob.stream(), (loaded) => {
			this.updateProgress(new Progress(total, loaded));
		});
	}
	async readAsBlob(contentType?: string): Promise<Blob> {
		if (contentType === this.blob.type) {
			return this.blob;
		}
		return new Blob([this.blob], { type: contentType });
	}
	readAsBuffer(): Promise<ArrayBuffer> {
		return this.blob.arrayBuffer();
	}
	total(): Promise<number> {
		return Promise.resolve(this.blob.size);
	}
}
