import { CachePolicy } from './CachePolicy';

/**
 * Creates a time-based caching policy with a fixed TTL
 *
 * @param ttl The time-to-live in milliseconds
 * @param name The name of the policy
 * @returns A new cache policy
 */
function createTimeBasedPolicy(
    ttl: number,
    name: string = `TimeBasedPolicy(${ttl}ms)`
): CachePolicy {
    return {
        name,
        shouldCache: () => true,
        getTTL: () => ttl,
        isValid: entry => entry.expiresAt > Date.now(),
    };
}

export const CachePolicies = {
    /**
     * No caching policy - nothing is cached
     */
    NoCache: {
        name: 'NoCache',
        shouldCache: () => false,
        getTTL: () => 0,
        isValid: () => false
    },

    /**
     * Default caching policy - caches for 5 minutes
     */
    Default: createTimeBasedPolicy(5 * 60 * 1000, 'Default'),

    createTimeBasedPolicy
} as const;
