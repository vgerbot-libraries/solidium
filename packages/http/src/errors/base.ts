/* eslint-disable @typescript-eslint/no-explicit-any */

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
