import type { ExecuteRequestMethodParams } from "../core/ExecuteRequestParams";
import type { RequestMethod } from "../core/RequestMethod";
import type { CachePolicy } from "./CachePolicy";

export interface CacheConfig {
	/**
	 * The cache policy to use
	 * @default CachePolicies.Default
	 */
	policy?: CachePolicy;

	/**
	 * Whether to respect Cache-Control headers from the response
	 * @default true
	 */
	respectCacheControl?: boolean;

	/**
	 * Custom function to determine if a request should be cached
	 */
	shouldCache?: (
		method: RequestMethod,
		params: ExecuteRequestMethodParams,
	) => boolean;

	/**
	 * Custom function to generate a cache key
	 */
	generateKey?: (
		method: RequestMethod,
		params: ExecuteRequestMethodParams,
	) => string;

	/**
	 * Name of the bucket to use for caching
	 */
	bucketName?: string;
}
