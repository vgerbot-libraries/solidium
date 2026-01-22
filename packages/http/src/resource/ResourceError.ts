import { HttpError, HttpStatusError } from "../errors/HttpError";

/**
 * Represents an error that occurred during resource processing
 */
export class ResourceError<B = unknown> {
	public static wrap(error: unknown) {
		if (error instanceof ResourceError) {
			return error;
		}
		return new ResourceError(error);
	}
	/**
	 * The original error that caused this resource error
	 */
	readonly originalError: unknown;

	/**
	 * HTTP status code if available
	 */
	readonly httpStatus?: number;

	/**
	 * HTTP status text if available
	 */
	readonly httpStatusText?: string;

	/**
	 * Response body if available
	 */
	readonly responseBody?: B;

	/**
	 * Error message
	 */
	readonly message: string;

	/**
	 * Error name/type
	 */
	readonly name: string;

	/**
	 * Create a new ResourceError
	 */
	constructor(error: unknown) {
		this.originalError = error;

		if (error instanceof HttpStatusError) {
			this.httpStatus = error.status;
			this.httpStatusText = error.statusText;
			this.responseBody = error.responseBody;
			this.message = error.message;
			this.name = error.name;
		} else if (error instanceof HttpError) {
			this.message = error.message;
			this.name = error.name;
		} else if (error instanceof Error) {
			this.message = error.message;
			this.name = error.name;
		} else {
			this.message = String(error);
			this.name = "UnknownError";
		}
	}

	/**
	 * Check if this is a client error (4xx)
	 */
	get isClientError(): boolean {
		return !!this.httpStatus && this.httpStatus >= 400 && this.httpStatus < 500;
	}

	/**
	 * Check if this is a server error (5xx)
	 */
	get isServerError(): boolean {
		return !!this.httpStatus && this.httpStatus >= 500;
	}

	/**
	 * Check if this is a network error
	 */
	get isNetworkError(): boolean {
		return this.name === "NetworkError";
	}

	/**
	 * Check if this is a timeout error
	 */
	get isTimeoutError(): boolean {
		return this.name === "TimeoutError";
	}

	/**
	 * Check if this is an abort error
	 */
	get isAbortError(): boolean {
		return this.name === "AbortError";
	}

	/**
	 * Check if this is a parse error
	 */
	get isParseError(): boolean {
		return this.name === "ParseError";
	}

	/**
	 * Convert to string
	 */
	toString(): string {
		return `${this.name}: ${this.message}`;
	}
}
