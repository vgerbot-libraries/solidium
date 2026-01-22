import type { RequestMethod } from "../core/RequestMethod";
import type { HttpHeaders } from "../http/HttpHeaders";
import type { HttpMethod } from "../http/HttpMethod";

export interface AdapterOptions {
	invokeMethod: RequestMethod;
	method: HttpMethod;
	url: string;
	headers: HttpHeaders;
	payload: BodyInit | undefined;
	signal: AbortSignal;
}
