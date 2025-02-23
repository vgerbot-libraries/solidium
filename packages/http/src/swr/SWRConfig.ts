import { Newable } from '@vgerbot/ioc';

export interface RevalidateOptions {
    /**
     * Auto revalidate on window focus
     * @default true
     */
    focus: boolean;
    /**
     * Auto revalidate on network recovery
     * @default true
     */
    reconnect: boolean;
    /**
     * Auto revalidate when data becomes stale
     * @default true
     */
    ifStale?: boolean;
    /**
     * Custom events that trigger revalidation
     * @default []
     */
    events: string[];
}

export interface SWRRetryContext {
    /**
     * The error that triggered the retry
     */
    error: unknown;
    /**
     * The current retry attempt number (starting from 1)
     */
    attempt: number;
    /**
     * Timestamp of when the error occurred
     */
    timestamp: number;
}

/**
 * Dynamically calculates the delay time (in milliseconds) for error retries.
 *
 * This function is used in error retry mechanisms to dynamically adjust the wait time for the next retry
 * based on the current retry attempt and the error type. By implementing strategies such as exponential backoff,
 * linear backoff, or custom logic, it helps prevent request storms, optimize resource utilization,
 * and improve user experience.
 *
 * @param attempt - The current retry attempt (starting from 1).
 * @param error - The error object that triggered the retry (optional).
 * @returns The delay time (in milliseconds) for the next retry. If `0` is returned, the retry will occur immediately.
 *
 * @example
 * // Default exponential backoff strategy
 * const defaultCalculateDelay = (attempt: number) => {
 *   const baseInterval = 1000; // Base interval
 *   const maxInterval = 30000; // Maximum interval
 *   const jitter = Math.random() * 100; // Add jitter to prevent thundering herd
 *   return Math.min(baseInterval * Math.pow(2, attempt - 1), maxInterval) + jitter;
 * };
 */
export type CalculateDelay = (attempt: number, error?: unknown) => number;

export interface SWRRetryConfig {
    /**
     * Maximum number of retry attempts
     * @default 3
     */
    maxAttempts: number;
    /**
     * Base interval between retries in milliseconds
     * @default 1000
     */
    interval: number;
    /**
     * Custom function to calculate delay between retries
     */
    calculateDelay?: CalculateDelay;
    /**
     * Custom function to determine if a retry should be attempted based on the error
     * @param ctx - Context containing error details and attempt count
     * @returns boolean indicating whether to retry
     */
    shouldRetryOnError?: (ctx: SWRRetryContext) => boolean;
}

export type RevalidateStrategyFunction = (
    revalidate: (reason?: string) => void
) => void;

export interface RevalidateStrategy {
    invoke(revalidate: (reason?: string) => void): void;
}

export function isRevalidateStrategyClass(
    value: unknown
): value is RevalidateStrategy {
    return (
        typeof value === 'function' &&
        'invoke' in value.prototype &&
        typeof value.prototype['invoke'] === 'function'
    );
}
export function isRevalidateStrategyFunction(
    value: unknown
): value is RevalidateStrategyFunction {
    return typeof value === 'function' && !isRevalidateStrategyClass(value);
}

export interface SWRThrottleConfig {
    /**
     * Throttle interval in milliseconds
     */
    interval: number;
    /**
     * Whether to trigger on the leading edge of the timeout
     * @default true
     */
    leading?: boolean;
    /**
     * Whether to trigger on the trailing edge of the timeout
     * @default true
     */
    trailing?: boolean;
}

export interface SWRRefreshConfig {
    /**
     * Polling interval in milliseconds. 0 to disable
     * @default 0
     */
    interval?: number;
    /**
     * Continue polling when window is invisible
     * @default false
     */
    whenHidden?: boolean;
    /**
     * Continue polling when offline
     * @default false
     */
    whenOffline?: boolean;
}

export interface SWRConfig {
    /**
     * Revalidation configuration
     */
    revalidate: {
        on: Partial<RevalidateOptions>;
        strategy?: Newable<RevalidateStrategy> | RevalidateStrategyFunction;
    };
    /**
     * Event throttling configuration
     */
    throttle?: {
        /**
         * Custom event throttle configurations
         */
        [event: string]: SWRThrottleConfig;
    };
    /**
     * Error retry configuration
     */
    retry?: SWRRetryConfig;
    /**
     * Auto refresh configuration
     */
    refresh?: SWRRefreshConfig;
    /**
     * Data expiration time in milliseconds. 0 for no expiration
     * @default 0
     */
    staleTime?: number;
    /**
     * Deduplication interval in milliseconds
     * @default 2000
     */
    dedupingInterval?: number;
}
