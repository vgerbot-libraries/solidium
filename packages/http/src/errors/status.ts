/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpError } from './base';
import { HttpHeaders } from '../http/HttpHeaders';

/**
 * Base class for HTTP status code errors
 */
export class HttpStatusError extends HttpError {
    constructor(
        public readonly status: number,
        public readonly statusText: string,
        public readonly headers: HttpHeaders,
        public readonly responseBody?: any,
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
