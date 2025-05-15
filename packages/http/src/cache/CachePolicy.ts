import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { RequestMethod } from '../core/RequestMethod';
import { CacheEntry } from './CacheEntry';

export interface CachePolicy {
    readonly name: string;

    /**
     * Determines if a request should be cached
     *
     * @param method The request method
     * @param params The parameters of the request
     * @returns True if the request should be cached, false otherwise
     */
    shouldCache(
        method: RequestMethod,
        params: ExecuteRequestMethodParams
    ): boolean;

    /**
     * Override the cache entry
     *
     * @param cacheEntry The cache entry
     * @param method The request method
     * @param params The parameters of the request
     * @returns The cache entry
     */
    overrideCacheEntry?(cacheEntry: CacheEntry, method: RequestMethod, params: ExecuteRequestMethodParams): CacheEntry;

    /**
     * Determines the TTL (time-to-live) for a cache entry
     *
     * @param method The request method
     * @param params The parameters of the request
     * @returns The TTL in milliseconds, or 0 to not cache
     */
    getTTL(method: RequestMethod, params: ExecuteRequestMethodParams): number;

    /**
     * Determines if a cached entry is still valid
     *
     * @param entry The cache entry
     * @param method The request method
     * @param params The parameters of the request
     * @returns True if the entry is valid, false if it should be invalidated
     */
    isValid(
        entry: CacheEntry,
        method: RequestMethod,
        params: ExecuteRequestMethodParams
    ): boolean;
}
