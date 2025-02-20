import { Newable } from '@vgerbot/ioc';

export interface RevalidateOptions {
    /**
     * Trigger revalidate when window is focused
     */
    focus: boolean;
    /**
     * Trigger revalidate when network connection is restored
     */
    reconnect: boolean;
    /**
     * Trigger revalidate when global events are triggered
     */
    events: string[];
}

export interface SWRRetryContext {
    error: unknown;
    attempt: number;
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
 *   return Math.min(baseInterval * Math.pow(2, attempt - 1), maxInterval);
 * };
 *
 * @example
 * // Linear backoff strategy
 * const linearDelay = (attempt: number) => attempt * 1000;
 *
 * @example
 * // Randomized backoff strategy
 * const randomDelay = (attempt: number) => Math.random() * 1000 * attempt;
 *
 * @example
 * // Dynamic backoff strategy based on error type
 * const dynamicDelay = (attempt: number, error: unknown) => {
 *   if (isNetworkError(error)) {
 *     return attempt * 1000; // Linear backoff for network errors
 *   }
 *   if (isServerError(error)) {
 *     return Math.min(5000 * attempt, 30000); // Longer backoff for server errors
 *   }
 *   return 0; // Immediate retry for other errors
 * };
 *
 * @example
 * // Fixed interval strategy
 * const fixedDelay = () => 2000; // Fixed 2-second delay for all retries
 *
 * @note
 * - If `calculateDelay` is not provided, the default exponential backoff strategy will be used.
 * - The returned delay time must be greater than or equal to `0`. If `0` is returned, the retry will occur immediately.
 * - It is recommended to use `calculateDelay` in conjunction with `maxAttempts` and `shouldRetry` to ensure reasonable 
 retry behavior.
 * - In high-concurrency scenarios, a randomized backoff strategy is recommended to avoid simultaneous retries.
 */
export type CalculateDelay = (attempt: number, error?: unknown) => number;

export interface SWRRetryConfig {
    maxAttempts: number;
    interval: number;
    calculateDelay?: CalculateDelay;
    shouldRetryOnError?: (ctx: SWRRetryContext) => boolean;
}

export type RevalidateStrategyFunction = (
    revalidate: (reason?: string) => void
) => void;

export interface RevalidateStrategy {
    invoke(revalidate: (reason?: string) => void): void;
}

export interface SWRCachingConfig {
    /**
     * Data expiration time (milliseconds), automatic revalidation after expiration
     */
    staleTime?: number;
    /**
     * Data deduplication interval (milliseconds) to prevent repeated requests in a short time
     */
    dedupingInterval?: number;
}

export interface SWRThrottleConfig {
    interval: number;
    leading?: boolean;
    trailing?: boolean;
}
export interface SWRRefreshConfig {
    /**
     * The time interval for automatic reverification (milliseconds), if set to 0, it will be disabled
     */
    interval?: number;
    /**
     * Whether the window is still refreshed automatically when it is not visible
     */
    whenHidden?: boolean;
}
export interface SWRConfig {
    revalidate: {
        on: RevalidateOptions;
        strategy: Newable<RevalidateStrategy> | RevalidateStrategyFunction;
    };
    throttle?: {
        [event: string]: SWRThrottleConfig;
    };

    retry?: SWRRetryConfig;
    refresh?: SWRRefreshConfig;
    caching?: SWRCachingConfig;
}
