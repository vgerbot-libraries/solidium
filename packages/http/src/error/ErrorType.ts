export enum ErrorType {
    /**
     * Timeout error
     */
    TIMEOUT = 'timeout',
    /**
     * Request aborted
     */
    CANCELLED = 'cancelled',
    /**
     * Network error
     */
    NETWORK_ERROR = 'network-error',
    /**
     * Parsing data error
     */
    UNPROCESSABLE_ENTITY = 'unprocessable-entity-error',
    /**
     * Unknown error
     */
    UNKNOWN_ERROR = 'unknown-error'
}
