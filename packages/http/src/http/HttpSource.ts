import type { ProgressHandler } from "../progress/ProgressHandler";
import type { ByteStream } from "./ByteStream";
import type { HttpHeaders } from "./HttpHeaders";

export interface HttpSource {
	status(): Promise<number>;
	headers(): Promise<HttpHeaders>;
	body(): Promise<ByteStream>;
	onDownload(listener: ProgressHandler): () => void;
	onUpload(listener: ProgressHandler): () => void;
	onBodyComplete(listener: (body: ByteStream) => void): () => void;
}
