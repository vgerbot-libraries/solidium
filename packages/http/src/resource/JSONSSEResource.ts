import { InstanceScope, Scope } from "@vgerbot/ioc";
import { isTextEventStream } from "../common/mime-utils";
import type { HttpResponse } from "../core/HttpResponse";
import { Resource } from "./Resource";

@Scope(InstanceScope.TRANSIENT)
export class JSONSSEResource<T> extends Resource<T> {
	protected async *resolveResponseBody(
		response: HttpResponse,
	): AsyncGenerator<unknown, void, unknown> {
		const headers = await response.headers();
		const contentType = headers.get("content-type")?.join(", ");
		if (isTextEventStream(contentType)) {
			yield* response.jsonStream();
		} else {
			yield* super.resolveResponseBody(response);
		}
	}
}
