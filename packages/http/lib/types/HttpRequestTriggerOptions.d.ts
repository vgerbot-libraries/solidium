export interface HttpRequestTriggerOptions {
    /**
     * Automatically sent request immediately after creation
     * Default: true
     */
    immediate?: boolean;
    /**
     * Automatically sent request immediately when the application is idle.
     * If set to true, 'immediate' parameter does not take effect.
     */
    idle?: boolean;
    /**
     * Automatically send requests at specified intervals.
     * Set in milliseconds; 0 is disabled.
     */
    interval?: number;
    /**
     * Automatically sent request when window has gotten focus.
     */
    onFocus?: boolean;
    /**
     * Automatically sent request when connection came back
     */
    onOnline?: boolean;
}
