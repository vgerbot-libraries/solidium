/* eslint-disable @typescript-eslint/no-explicit-any */

import type { HttpHeaders } from "../http/HttpHeaders";
import { HttpStatusError } from "./status";

/**
 * Base class for server errors (5xx)
 */
export class ServerError extends HttpStatusError {
	constructor(
		status: number,
		statusText: string,
		headers: HttpHeaders,
		responseBody?: any,
		message?: string,
	) {
		super(
			status,
			statusText,
			headers,
			responseBody,
			message || `Server Error: ${status} ${statusText}`,
		);
	}
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends ServerError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Internal Server Error",
	) {
		super(500, "Internal Server Error", headers, responseBody, message);
	}
}

/**
 * 501 Not Implemented
 */
export class NotImplementedError extends ServerError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Not Implemented",
	) {
		super(501, "Not Implemented", headers, responseBody, message);
	}
}

/**
 * 502 Bad Gateway
 */
export class BadGatewayError extends ServerError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Bad Gateway",
	) {
		super(502, "Bad Gateway", headers, responseBody, message);
	}
}

/**
 * 503 Service Unavailable
 */
export class ServiceUnavailableError extends ServerError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Service Unavailable",
	) {
		super(503, "Service Unavailable", headers, responseBody, message);
	}
}

/**
 * 504 Gateway Timeout
 */
export class GatewayTimeoutError extends ServerError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Gateway Timeout",
	) {
		super(504, "Gateway Timeout", headers, responseBody, message);
	}
}

/**
 * 505 HTTP Version Not Supported
 */
export class HTTPVersionNotSupportedError extends ServerError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "HTTP Version Not Supported",
	) {
		super(505, "HTTP Version Not Supported", headers, responseBody, message);
	}
}

/**
 * 506 Variant Also Negotiates
 */
export class VariantAlsoNegotiatesError extends ServerError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Variant Also Negotiates",
	) {
		super(506, "Variant Also Negotiates", headers, responseBody, message);
	}
}

/**
 * 507 Insufficient Storage
 */
export class InsufficientStorageError extends ServerError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Insufficient Storage",
	) {
		super(507, "Insufficient Storage", headers, responseBody, message);
	}
}

/**
 * 508 Loop Detected
 */
export class LoopDetectedError extends ServerError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Loop Detected",
	) {
		super(508, "Loop Detected", headers, responseBody, message);
	}
}

/**
 * 510 Not Extended
 */
export class NotExtendedError extends ServerError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Not Extended",
	) {
		super(510, "Not Extended", headers, responseBody, message);
	}
}

/**
 * 511 Network Authentication Required
 */
export class NetworkAuthenticationRequiredError extends ServerError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Network Authentication Required",
	) {
		super(
			511,
			"Network Authentication Required",
			headers,
			responseBody,
			message,
		);
	}
}
