import { HttpHeaders } from '../http/HttpHeaders';

/**
 * Base class for all HTTP-related errors
 */
export abstract class HttpError extends Error {
    constructor(
        message: string,
        public readonly cause?: Error
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

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

/**
 * Error thrown when the server returns an error status code
 */
export class HttpStatusError<E = unknown> extends HttpError {
    constructor(
        public readonly status: number,
        public readonly statusText: string,
        public readonly headers: HttpHeaders,
        public readonly responseBody?: E | string,
        message?: string
    ) {
        super(message || `HTTP Error ${status}: ${statusText}`);
    }

    /**
     * Check if this is a client error (4xx)
     */
    get isClientError(): boolean {
        return this.status >= 400 && this.status < 500;
    }

    /**
     * Check if this is a server error (5xx)
     */
    get isServerError(): boolean {
        return this.status >= 500;
    }
}

/**
 * Specific HTTP status errors for common cases
 */
export class UnauthorizedError<E = unknown> extends HttpStatusError<E> {
    constructor(
        headers: HttpHeaders,
        responseBody?: E | string,
        message = 'Unauthorized'
    ) {
        super(401, 'Unauthorized', headers, responseBody, message);
    }
}

export class ForbiddenError<E = unknown> extends HttpStatusError<E> {
    constructor(
        headers: HttpHeaders,
        responseBody?: E | string,
        message = 'Forbidden'
    ) {
        super(403, 'Forbidden', headers, responseBody, message);
    }
}

export class NotFoundError<E = unknown> extends HttpStatusError<E> {
    constructor(
        headers: HttpHeaders,
        responseBody?: E | string,
        message = 'Not Found'
    ) {
        super(404, 'Not Found', headers, responseBody, message);
    }
}

export class ServerError<E = unknown> extends HttpStatusError<E> {
    constructor(
        status: number,
        statusText: string,
        headers: HttpHeaders,
        responseBody?: E | string,
        message?: string
    ) {
        super(
            status,
            statusText,
            headers,
            responseBody,
            message || `Server Error: ${status} ${statusText}`
        );
    }
}
