import type { EndpointInstance } from "../core/EndpointInstance";
import type { ExecuteRequestMethodParams } from "../core/ExecuteRequestParams";
import type {
	Interceptor,
	InterceptorTypeIdentifier,
} from "../core/Interceptor";
import type { RequestMethod } from "../core/RequestMethod";
import type { RequestOptions } from "../decorators/Request";
import { HttpHeaders } from "../http/HttpHeaders";

export type ExecutionHandler = (
	instance: EndpointInstance,
	method: RequestMethod,
	params: ExecuteRequestMethodParams,
	args: unknown[],
) => void;

export class RequestMethodMetadata {
	private readonly executionHandlers: ExecutionHandler[] = [];
	private readonly extra = new Map<string | symbol, unknown>();
	private readonly options: RequestOptions = { path: "/", method: "GET" };
	private readonly externalInterceptors: Array<
		Interceptor | InterceptorTypeIdentifier
	> = [];
	constructor(public readonly name: string | symbol) {}
	setOptions(options: RequestOptions) {
		Object.assign(this.options, options);
	}
	getExtra<T>(key: string | symbol) {
		return this.extra.get(key) as T;
	}
	setExtra<T>(key: string | symbol, value: T) {
		this.extra.set(key, value);
	}
	getRetryConfig() {
		return this.options.retry;
	}
	appendExecutionHandler(handler: ExecutionHandler) {
		this.executionHandlers.push(handler);
	}
	getExecutionHandlers() {
		return this.executionHandlers.slice(0);
	}
	getPath() {
		return this.options.path;
	}
	getHttpMethod() {
		return this.options.method;
	}
	getHeaders() {
		const headers = new HttpHeaders();
		headers.setAll(this.options.headers ?? {});
		return headers;
	}
	getTimeout() {
		return this.options.timeout ?? 0;
	}
	getInterceptors() {
		return (this.options.interceptors ?? []).concat(this.externalInterceptors);
	}
	getExcludeInterceptors() {
		return this.options.excludeInterceptors ?? [];
	}
	getAdapter() {
		return this.options.adapter;
	}
	isReactive() {
		return this.options.reactive ?? true;
	}
	appendInterceptor(interceptor: Interceptor | InterceptorTypeIdentifier) {
		this.externalInterceptors.push(interceptor);
	}
}
