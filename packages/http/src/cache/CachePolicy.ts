import type { ExecuteRequestMethodParams } from "../core/ExecuteRequestParams";
import type { RequestMethod } from "../core/RequestMethod";
import type { CacheEntry } from "./CacheEntry";

/**
 * Defines a caching policy for HTTP responses.
 *
 * A cache policy controls how and when HTTP responses are cached. It determines:
 * - Whether a request should be cached
 * - How long cached data remains valid (TTL)
 * - When cached data should be invalidated
 * - Optional modifications to cache entries
 *
 * You can implement custom policies for advanced caching strategies such as:
 * - Time-based expiration (TTL)
 * - Conditional caching based on request/response headers
 * - Cache warming and pre-fetching
 * - Adaptive caching based on usage patterns
 * - ETag-based validation
 *
 * @example
 * Simple time-based policy:
 * ```typescript
 * const myPolicy: CachePolicy = {
 *   name: 'MyPolicy',
 *   shouldCache: () => true,
 *   getTTL: () => 60000, // 1 minute
 *   isValid: (entry) => entry.expiresAt > Date.now()
 * };
 * ```
 *
 * @example
 * Conditional policy based on request:
 * ```typescript
 * const conditionalPolicy: CachePolicy = {
 *   name: 'ConditionalPolicy',
 *   shouldCache: (method, params) => {
 *     // Only cache if not explicitly forcing refresh
 *     return !params.force;
 *   },
 *   getTTL: (method, params) => {
 *     // Different TTL based on endpoint
 *     if (method.url.includes('/static/')) return 24 * 60 * 60 * 1000; // 1 day
 *     return 5 * 60 * 1000; // 5 minutes
 *   },
 *   isValid: (entry) => entry.expiresAt > Date.now()
 * };
 * ```
 *
 * @example
 * Policy with cache entry metadata:
 * ```typescript
 * const taggedPolicy: CachePolicy = {
 *   name: 'TaggedPolicy',
 *   shouldCache: () => true,
 *   getTTL: () => 300000,
 *   isValid: (entry) => entry.expiresAt > Date.now(),
 *   overrideCacheEntry: (entry, method, params) => ({
 *     ...entry,
 *     metadata: {
 *       ...entry.metadata,
 *       tags: ['user-data'],
 *       userId: params.pathVariables['id']
 *     }
 *   })
 * };
 * ```
 */
export interface CachePolicy {
	/** Human-readable name for the policy (used for debugging and logging) */
	readonly name: string;

	/**
	 * Determines if a request should be cached.
	 *
	 * This method is called before making the request to decide if the
	 * response should be cached. Return `false` to bypass caching entirely.
	 *
	 * @param method - The request method being invoked
	 * @param params - The request parameters
	 * @returns `true` if the response should be cached, `false` otherwise
	 */
	shouldCache(
		method: RequestMethod,
		params: ExecuteRequestMethodParams,
	): boolean;

	/**
	 * Optionally modifies or enriches a cache entry before it's stored.
	 *
	 * Use this to add custom metadata, tags, or other information to the
	 * cache entry. This is useful for cache invalidation strategies,
	 * cache statistics, or debugging.
	 *
	 * @param cacheEntry - The cache entry about to be stored
	 * @param method - The request method
	 * @param params - The request parameters
	 * @returns The modified cache entry
	 */
	overrideCacheEntry?(
		cacheEntry: CacheEntry,
		method: RequestMethod,
		params: ExecuteRequestMethodParams,
	): CacheEntry;

	/**
	 * Determines the TTL (time-to-live) for a cache entry in milliseconds.
	 *
	 * This value is used to calculate the expiration time for the cached data.
	 * Return `0` to indicate that the response should not be cached.
	 *
	 * @param method - The request method
	 * @param params - The request parameters
	 * @returns The TTL in milliseconds, or `0` to not cache
	 */
	getTTL(method: RequestMethod, params: ExecuteRequestMethodParams): number;

	/**
	 * Determines if a cached entry is still valid.
	 *
	 * This method is called when retrieving data from the cache to verify
	 * it's still usable. Return `false` to invalidate the cache entry and
	 * trigger a new request.
	 *
	 * Common validation strategies:
	 * - Check if current time is before expiration time
	 * - Verify ETags or version numbers
	 * - Check if data structure is still compatible
	 *
	 * @param entry - The cached entry to validate
	 * @param method - The request method
	 * @param params - The request parameters
	 * @returns `true` if the entry is valid, `false` to invalidate and refetch
	 */
	isValid(
		entry: CacheEntry,
		method: RequestMethod,
		params: ExecuteRequestMethodParams,
	): boolean;
}
