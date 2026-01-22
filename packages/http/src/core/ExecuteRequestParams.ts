import type { RequestAdapterConstructor } from "../adapter/RequestAdapter";
import type { HttpHeaders } from "../http/HttpHeaders";
import type { HttpMethod } from "../http/HttpMethod";

export interface ExecuteRequestMethodParams {
	readonly method: HttpMethod;
	readonly signal?: AbortSignal;
	readonly headers: HttpHeaders;
	readonly pathVariables: Record<string, string | number | boolean>;
	readonly queryParams: URLSearchParams;
	payload?: BodyInit;
	adapter?: RequestAdapterConstructor;
	args: unknown[];
	/**
	 * When true, indicates that the request should bypass cache
	 */
	force?: boolean;
}
