import type { RequestAdapterConstructor } from "../adapter/RequestAdapter";
import type { Class } from "../common/Class";
import { joinPath } from "../common/joinPath";
import {
	buildEndpointClass,
	type EndpointInstance,
} from "../core/EndpointInstance";
import type {
	Interceptor,
	InterceptorTypeIdentifier,
} from "../core/Interceptor";
import { HttpHeaders } from "../http/HttpHeaders";
import { RequestMethodMetadata } from "./RequestMethodMetadata";

interface BaseEndpointOptions {
	baseURL: string;
	path?: string;
	timeout?: number;
	headers?: Record<string, string | string[]>;
	adapter?: RequestAdapterConstructor;
	interceptors?: Array<InterceptorTypeIdentifier | Interceptor>;
}
export type EndpointOptions =
	| ({
			extends: Function;
	  } & Partial<BaseEndpointOptions>)
	| BaseEndpointOptions;
const ENDPOINT_METADATA_KEY = "@http:endpoint";
export class EndpointMetadata {
	static from(target: Function) {
		if (Reflect.hasMetadata(ENDPOINT_METADATA_KEY, target)) {
			return Reflect.getMetadata(
				ENDPOINT_METADATA_KEY,
				target,
			) as EndpointMetadata;
		}
		const metadata = new EndpointMetadata();
		Reflect.defineMetadata(ENDPOINT_METADATA_KEY, metadata, target);
		Reflect.defineMetadata(ENDPOINT_METADATA_KEY, metadata, target.prototype);

		buildEndpointClass(target as Class<EndpointInstance>, metadata);

		return metadata;
	}
	static fromInstance(target: EndpointInstance) {
		const prototype = Object.getPrototypeOf(target);
		const metadata = Reflect.getMetadata(ENDPOINT_METADATA_KEY, prototype);
		if (metadata instanceof EndpointMetadata) {
			return metadata;
		}
		return EndpointMetadata.from(prototype.constructor);
	}
	private baseURL!: string;
	private timeout: number = 0;
	private headers = new HttpHeaders();
	private readonly methods = new Map<string | symbol, RequestMethodMetadata>();
	private adapter?: RequestAdapterConstructor;
	private interceptors?: Array<InterceptorTypeIdentifier | Interceptor>;

	private constructor() {}

	setOptions(endpointOptions: EndpointOptions) {
		if ("extends" in endpointOptions) {
			const parent = EndpointMetadata.from(endpointOptions.extends);
			this.baseURL = endpointOptions.baseURL ?? parent.baseURL;
			this.timeout = parent.timeout;
			this.headers = this.headers.concat(parent.headers);
			this.interceptors = parent.interceptors;
			this.adapter = parent.adapter;
		} else {
			this.baseURL = endpointOptions.baseURL;
		}
		if (!this.baseURL) {
			if (typeof document === "object") {
				this.baseURL = document.baseURI;
			} else {
				throw new Error("baseURL is not set");
			}
		}
		this.baseURL = joinPath(this.baseURL, endpointOptions.path ?? "");
		if (endpointOptions.timeout) {
			this.timeout = endpointOptions.timeout;
		}
		if (endpointOptions.headers) {
			const headers = endpointOptions.headers;
			this.headers.setAll(headers);
		}
		if (endpointOptions.interceptors) {
			if (this.interceptors) {
				this.interceptors = this.interceptors.concat(
					endpointOptions.interceptors,
				);
			} else {
				this.interceptors = endpointOptions.interceptors;
			}
		}
		if (endpointOptions.adapter) {
			this.adapter = endpointOptions.adapter;
		}
	}
	getMethodMetadata(methodName: string | symbol) {
		let metadata = this.methods.get(methodName);
		if (!metadata) {
			this.methods.set(
				methodName,
				(metadata = new RequestMethodMetadata(methodName)),
			);
		}
		return metadata;
	}
	setMethodMetadata(
		methodName: string | symbol,
		methodMetadata: RequestMethodMetadata,
	) {
		this.methods.set(methodName, methodMetadata);
	}
	getMethods() {
		return this.methods;
	}
	getInterceptors(): Array<InterceptorTypeIdentifier | Interceptor> {
		return this.interceptors ?? [];
	}
	getAdaptor(): RequestAdapterConstructor | undefined {
		return this.adapter;
	}
	getBaseURL() {
		return this.baseURL;
	}
	getHeaders() {
		return this.headers;
	}
	getTimeout() {
		return this.timeout;
	}
}
