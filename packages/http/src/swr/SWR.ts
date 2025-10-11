import { decorateEndpointMethod } from '../helper/decorateEndpointMethod';
import { EXTRA_METADATA_SWR_CONFIG, EXTRA_METADATA_SWR_KEYGEN } from './consts';
import { SWRConfig } from './SWRConfig';

type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

/**
 * Configuration options for the {@link SWR} decorator.
 *
 * Extends {@link SWRConfig} with an optional custom cache key generator.
 */
export interface SWRDecoratorConfig extends DeepPartial<SWRConfig> {
    /**
     * Custom cache key for the SWR instance.
     *
     * Can be either:
     * - A static string key
     * - A function that generates a key based on method arguments
     *
     * If not provided, the resolved URL will be used as the cache key.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    key?: string | ((...args: any[]) => string);
}

/**
 * Decorator that enables SWR (Stale-While-Revalidate) pattern for an endpoint method.
 *
 * The SWR pattern provides:
 * - **Automatic caching**: Responses are cached and reused for subsequent requests
 * - **Background revalidation**: Cached data is served immediately while fresh data is fetched in the background
 * - **Focus revalidation**: Automatically refetches when the window regains focus
 * - **Network recovery**: Automatically refetches when network connection is restored
 * - **Polling**: Optional automatic refresh at specified intervals
 * - **Deduplication**: Multiple requests with the same key are deduplicated
 *
 * This significantly improves user experience by showing cached data instantly while ensuring
 * data freshness through background updates.
 *
 * @param config - SWR configuration options
 * @param config.key - Optional custom cache key (string or function)
 * @param config.revalidate - Revalidation triggers configuration
 * @param config.revalidate.focus - Auto revalidate on window focus (default: true)
 * @param config.revalidate.reconnect - Auto revalidate on network recovery (default: true)
 * @param config.revalidate.events - Custom events that trigger revalidation
 * @param config.refresh - Automatic refresh configuration
 * @param config.refresh.interval - Polling interval in milliseconds (0 to disable)
 * @param config.refresh.whenHidden - Continue polling when window is invisible
 * @param config.refresh.whenOffline - Continue polling when offline
 * @param config.retry - Error retry configuration
 * @param config.staleTime - Time in milliseconds before data becomes stale
 * @param config.dedupingInterval - Deduplication interval in milliseconds
 *
 * @example
 * Basic usage with default config:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   @SWR()
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 *
 * // First call: fetches from server
 * const resource1 = api.getUser('123');
 *
 * // Second call: returns cached data immediately, revalidates in background
 * const resource2 = api.getUser('123');
 * ```
 *
 * @example
 * With custom revalidation settings:
 * ```typescript
 * @Get('/notifications')
 * @SWR({
 *   revalidate: {
 *     focus: true,        // Revalidate on window focus
 *     reconnect: true,    // Revalidate on network recovery
 *     events: ['user-action'] // Revalidate on custom events
 *   }
 * })
 * getNotifications() {
 *   return restful<Notification[]>();
 * }
 * ```
 *
 * @example
 * With polling:
 * ```typescript
 * @Get('/status')
 * @SWR({
 *   refresh: {
 *     interval: 5000,      // Poll every 5 seconds
 *     whenHidden: false,   // Pause when tab is hidden
 *     whenOffline: false   // Pause when offline
 *   }
 * })
 * getSystemStatus() {
 *   return restful<SystemStatus>();
 * }
 * ```
 *
 * @example
 * With custom cache key:
 * ```typescript
 * @Get('/users/{id}')
 * @SWR({
 *   key: (id: string) => `user-profile-${id}`,
 *   staleTime: 60000  // Consider data stale after 1 minute
 * })
 * getUser(@PathVariable('id') id: string) {
 *   return restful<User>(id);
 * }
 * ```
 *
 * @returns A method decorator
 *
 * @see {@link SWRConfig} for detailed configuration options
 * @see {@link SWRMutation} for invalidating SWR cache after mutations
 */
export function SWR(config: SWRDecoratorConfig = {}) {
    return decorateEndpointMethod((clazz, methodName, methodMetadata) => {
        methodMetadata.setExtra(EXTRA_METADATA_SWR_KEYGEN, config.key);
        methodMetadata.setExtra(EXTRA_METADATA_SWR_CONFIG, config);
    });
}
