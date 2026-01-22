import { HttpError } from './base';

/**
 * Error thrown when a request times out
 */
export class TimeoutError extends HttpError {
    constructor(
        message = 'Request timed out',
        public readonly context: Record<string, unknown>,
        cause?: Error
    ) {
        super(message, cause);
    }
}

/**
 * Error thrown when there's a network issue
 */
export class NetworkError extends HttpError {
    constructor(message = 'Network error occurred', cause?: Error) {
        super(message, cause);
    }
}

/**
 * Error thrown when a request is aborted
 */
export class AbortError extends HttpError {
    constructor(message = 'Request was aborted', cause?: Error) {
        super(message, cause);
    }
}

/**
 * Error thrown when there's an issue parsing the response
 */
export class ParseError extends HttpError {
    constructor(message = 'Failed to parse response', cause?: Error) {
        super(message, cause);
    }
}
