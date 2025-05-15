import { CacheConfig } from './CacheConfig';
import { CachePolicies } from './CachePolicies';

export const DEFAULT_CACHE_CONFIG: CacheConfig = {
    policy: CachePolicies.Default,
    respectCacheControl: true
};
