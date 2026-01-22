import type { CachePolicy } from "./CachePolicy";

/**
 * Creates a time-based caching policy with a fixed TTL (Time-To-Live).
 *
 * This factory function creates a simple caching policy where cached entries
 * expire after a fixed duration. It's the most common caching strategy for
 * data that changes predictably over time.
 *
 * @param ttl - The time-to-live in milliseconds (how long cached data remains valid)
 * @param name - Optional name for the policy (defaults to 'TimeBasedPolicy(${ttl}ms)')
 * @returns A new {@link CachePolicy} instance
 *
 * @example
 * ```typescript
 * const fiveMinutePolicy = CachePolicies.createTimeBasedPolicy(5 * 60 * 1000);
 * const oneHourPolicy = CachePolicies.createTimeBasedPolicy(60 * 60 * 1000);
 *
 * @Get('/data')
 * @Cache({ policy: fiveMinutePolicy })
 * getData() {
 *   return restful<Data>();
 * }
 * ```
 */
function createTimeBasedPolicy(
	ttl: number,
	name: string = `TimeBasedPolicy(${ttl}ms)`,
): CachePolicy {
	return {
		name,
		shouldCache: () => true,
		getTTL: () => ttl,
		isValid: (entry) => entry.expiresAt > Date.now(),
	};
}

/**
 * Collection of predefined caching policies for common use cases.
 *
 * This object provides convenient, ready-to-use caching policies that cover
 * the most common caching scenarios. You can use these directly or create
 * custom policies using {@link createTimeBasedPolicy} or by implementing
 * the {@link CachePolicy} interface.
 *
 * @example
 * Using predefined policies:
 * ```typescript
 * // No caching
 * @Get('/live-data')
 * @Cache({ policy: CachePolicies.NoCache })
 * getLiveData() {
 *   return restful<Data>();
 * }
 *
 * // Default 5-minute cache
 * @Get('/user-profile')
 * @Cache({ policy: CachePolicies.Default })
 * getUserProfile() {
 *   return restful<User>();
 * }
 * ```
 *
 * @example
 * Creating custom time-based policies:
 * ```typescript
 * const oneHourCache = CachePolicies.createTimeBasedPolicy(60 * 60 * 1000);
 * const oneDay Cache = CachePolicies.createTimeBasedPolicy(24 * 60 * 60 * 1000);
 *
 * @Get('/daily-stats')
 * @Cache({ policy: oneDayCache })
 * getDailyStats() {
 *   return restful<Stats>();
 * }
 * ```
 */
export const CachePolicies = {
	/**
	 * No caching policy - all requests bypass the cache.
	 *
	 * Use this when you need to ensure data is always fresh,
	 * or to disable caching for specific endpoints.
	 */
	NoCache: {
		name: "NoCache",
		shouldCache: () => false,
		getTTL: () => 0,
		isValid: () => false,
	},

	/**
	 * Default caching policy - caches responses for 5 minutes.
	 *
	 * A reasonable default for most API endpoints that don't require
	 * real-time data but benefit from reduced server load.
	 */
	Default: createTimeBasedPolicy(5 * 60 * 1000, "Default"),

	/**
	 * Factory function to create custom time-based caching policies.
	 *
	 * @see {@link createTimeBasedPolicy} for documentation and examples
	 */
	createTimeBasedPolicy,
} as const;
