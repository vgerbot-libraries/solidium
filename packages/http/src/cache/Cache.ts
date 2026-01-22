import { decorateEndpointMethod } from "../helper/decorateEndpointMethod";
import type { RequestMethodMetadata } from "../metadata/RequestMethodMetadata";
import type { CacheConfig } from "./CacheConfig";
import { CacheInterceptor } from "./CacheInterceptor";
import { DEFAULT_CACHE_CONFIG } from "./constants";

/**
 * Decorator that applies the CacheInterceptor to an endpoint method.
 *
 * @example
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com'
 * })
 * class ExampleAPI {
 *   @Get('/users/{id}')
 *   @Cache({
 *     policy: CachePolicies.createTimeBasedPolicy(60 * 1000) // 1 minute cache
 *   })
 *   getUser(id: number) {
 *     return restful<User>();
 *   }
 * }
 * ```
 */
export function Cache(config: CacheConfig = DEFAULT_CACHE_CONFIG) {
	return decorateEndpointMethod(
		(
			_clazz: NewableFunction,
			_methodName: string | symbol,
			methodMetadata: RequestMethodMetadata,
		) => {
			methodMetadata.appendInterceptor(
				CacheInterceptor.createWithConfig(config),
			);
		},
	);
}
