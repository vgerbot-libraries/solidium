import type { ByteStream } from "../http/ByteStream";
import type { HttpHeaders } from "../http/HttpHeaders";
import type { HttpSource } from "../http/HttpSource";
import type { ProgressHandler } from "../progress/ProgressHandler";
import type { RequestMethod } from "./RequestMethod";

/**
 * Initialization options for creating an {@link HttpResponse}.
 */
export interface HttpResponseInit {
	/** The request method that generated this response */
	method: RequestMethod;
}

/**
 * Represents an HTTP response with utilities for parsing and streaming data.
 *
 * This class wraps the low-level {@link HttpSource} and provides convenient
 * methods for accessing response data in various formats:
 * - Plain text (`text()`)
 * - JSON (`json()`)
 * - Streaming text (`textStream()`)
 * - Streaming JSON/SSE (`jsonStream()`)
 * - Raw byte stream (`body()`)
 *
 * It also provides access to:
 * - Response status code
 * - Response headers
 * - Upload/download progress tracking
 *
 * Instances are typically created automatically by the framework and accessed
 * through the Resource abstraction or interceptors.
 *
 * @example
 * Accessing response in an interceptor:
 * ```typescript
 * class LoggingInterceptor implements Interceptor {
 *   async invoke(instance, method, params, next) {
 *     const response = await next(instance, method, params);
 *     const status = await response.status();
 *     const headers = await response.headers();
 *     console.log(`Response ${status}:`, headers.toJSON());
 *     return response;
 *   }
 * }
 * ```
 *
 * @example
 * Creating a response manually (e.g., for testing):
 * ```typescript
 * const response = HttpResponse.of(
 *   Promise.resolve(new BlobByteStream(new Blob(['{"data": "value"}']))),
 *   new HttpHeaders({ 'Content-Type': 'application/json' }),
 *   200,
 *   method
 * );
 *
 * const data = await response.json();
 * ```
 */
export class HttpResponse implements HttpSource {
	static of(
		body: Promise<ByteStream>,
		headers: HttpHeaders,
		status: number,
		method: RequestMethod,
	) {
		return new HttpResponse(
			{
				status: () => Promise.resolve(status),
				headers: () => Promise.resolve(headers),
				body: () => body,
				onDownload() {
					return () => undefined;
				},
				onUpload() {
					return () => undefined;
				},
				onBodyComplete() {
					return () => undefined;
				},
			},
			{ method },
		);
	}
	constructor(
		private readonly source: HttpSource,
		public readonly init: HttpResponseInit,
	) {}
	status() {
		return this.source.status();
	}
	headers(): Promise<HttpHeaders> {
		return this.source.headers();
	}
	body(): Promise<ByteStream> {
		return this.source.body();
	}
	async text(encoding?: string) {
		const stream = await this.body();
		const buffer = await stream.readAsBuffer();
		const decoder = new TextDecoder(encoding);
		return decoder.decode(buffer);
	}
	async json<T>() {
		const text = await this.text();
		return JSON.parse(text) as T;
	}
	async *textStream(encoding: string = "UTF-8") {
		const byteStream = await this.source.body();
		const stream = byteStream.readAsStream();
		const reader = stream.getReader();
		const decoder = new TextDecoder(encoding);
		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}
			yield decoder.decode(value, {});
		}
	}
	async *jsonStream<T>(encoding: string = "UTF-8") {
		const regex = /event:\s*?([^\s\n\r]+?)[\n\r\s]*data:\s*?(.*?)\s*$/i;
		for await (const chunk of this.textStream(encoding)) {
			const [, event, data] = regex.exec(chunk) ?? [];
			if (event !== "message" || !data) {
				continue;
			}
			yield JSON.parse(data) as T;
		}
	}
	onUpload(listener: ProgressHandler): () => void {
		return this.source.onUpload(listener);
	}
	onDownload(listener: ProgressHandler): () => void {
		return this.source.onDownload(listener);
	}
	onBodyComplete(listener: (body: ByteStream) => void): () => void {
		return this.source.onBodyComplete(listener);
	}
}
