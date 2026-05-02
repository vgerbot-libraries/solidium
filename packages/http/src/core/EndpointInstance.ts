import { ApplicationContext, Generate, Inject } from "@vgerbot/ioc";
import type { RequestAdapterConstructor } from "../adapter/RequestAdapter";
import type { Class } from "../common/Class";
import type { EndpointMetadata } from "../metadata/EndpointMetadata";
import {
	ABORT_CONTROLLER,
	ADAPTER,
	APPLICATION_CONTEXT,
	CONSTRUCT_INTERCEPTORS,
	GET_INTERCEPTORS,
	HTTP_CONFIGURATION,
	METHODS,
} from "./EndpointMembers";
import { DEFAULT_HTTP_CONFIGURATION, type HttpConfiguration } from "./Http";
import {
	type Interceptor,
	type InterceptorConstructor,
	type InterceptorTypeIdentifier,
	isInterceptor,
} from "./Interceptor";
import { RequestMethod } from "./RequestMethod";

export interface EndpointInstance {
	[METHODS]: Map<string | symbol, RequestMethod>;
	[GET_INTERCEPTORS]: (
		exclude?: Array<InterceptorTypeIdentifier | Interceptor>,
	) => Interceptor[];
	[ADAPTER]?: RequestAdapterConstructor;
	[CONSTRUCT_INTERCEPTORS]: (
		interceptors: Array<InterceptorTypeIdentifier | Interceptor>,
	) => Interceptor[];
	[ABORT_CONTROLLER]: AbortController;
	[APPLICATION_CONTEXT]: ApplicationContext;
	[HTTP_CONFIGURATION]?: HttpConfiguration;
}

export function buildEndpointClass(
	endpointClass: Class<EndpointInstance>,
	metadata: EndpointMetadata,
) {
	Reflect.set(
		endpointClass.prototype,
		GET_INTERCEPTORS,
		function (
			this: EndpointInstance,
			exclude?: Array<InterceptorTypeIdentifier | Interceptor>,
		) {
			const globalInterceptors = this[HTTP_CONFIGURATION]?.interceptors ?? [];
			return [...globalInterceptors, ...metadata.getInterceptors()]
				.filter((it) => !exclude?.includes(it))
				.flatMap((identifier) => {
					if (isInterceptor(identifier)) {
						return identifier;
					}
					return this[APPLICATION_CONTEXT].getInstance(identifier);
				});
		},
	);

	Reflect.set(endpointClass.prototype, ADAPTER, metadata.getAdaptor());

	Generate<
		EndpointInstance,
		(
			interceptors: Array<InterceptorConstructor | string | symbol>,
		) => Interceptor[]
	>(
		(appCtx: ApplicationContext) =>
			(
				interceptors: Array<
					InterceptorConstructor | string | symbol | Interceptor
				>,
			) => {
				return interceptors.flatMap((identifier) => {
					if (typeof identifier === "object") {
						return identifier;
					}
					return appCtx.getInstance(identifier);
				});
			},
	)(endpointClass.prototype, CONSTRUCT_INTERCEPTORS);

	const lazilyMembers = new WeakMap<
		EndpointInstance,
		Map<PropertyKey, unknown>
	>();
	function getProperty(
		obj: EndpointInstance,
		key: PropertyKey,
		factory: (instance: EndpointInstance) => unknown,
	) {
		const map = lazilyMembers.get(obj) ?? new Map();
		lazilyMembers.set(obj, map);
		if (!map.has(key)) {
			map.set(key, factory(obj));
		}
		return map.get(key);
	}
	function defineLazyProperty(
		key: PropertyKey,
		factory: (instance: EndpointInstance) => unknown,
	) {
		Object.defineProperty(endpointClass.prototype, key, {
			get() {
				return getProperty(this, key, factory);
			},
		});
	}

	defineLazyProperty(ABORT_CONTROLLER, () => new AbortController());
	defineLazyProperty(METHODS, () => {
		const methods = new Map();
		metadata.getMethods().forEach((methodMetadata, methodName) => {
			methods.set(
				methodName,
				new RequestMethod(methodName, metadata, methodMetadata),
			);
		});
		return methods;
	});
	defineLazyProperty(HTTP_CONFIGURATION, (instance) => {
		return instance[APPLICATION_CONTEXT].getInstance(
			DEFAULT_HTTP_CONFIGURATION,
		);
	});

	Inject(ApplicationContext)(endpointClass.prototype, APPLICATION_CONTEXT);
}
