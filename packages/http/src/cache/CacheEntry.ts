export interface CacheEntry {
    /** The cached response data */
    response: {
        status: number;
        headers: Record<string, string[]>;
        body: Uint8Array;
    };
    /** When the entry was cached */
    cachedAt: number;
    /** When the entry expires (based on Cache-Control or config) */
    expiresAt: number;

    /** Metadata about the entry */
    metadata: Record<string, any>;
}
