/* eslint-disable @typescript-eslint/no-explicit-any */

import type { HttpHeaders } from "../http/HttpHeaders";
import { HttpStatusError } from "./status";

/**
 * 400 Bad Request
 */
export class BadRequestError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Bad Request",
	) {
		super(400, "Bad Request", headers, responseBody, message);
	}
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Unauthorized",
	) {
		super(401, "Unauthorized", headers, responseBody, message);
	}
}

/**
 * 402 Payment Required
 */
export class PaymentRequiredError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Payment Required",
	) {
		super(402, "Payment Required", headers, responseBody, message);
	}
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends HttpStatusError {
	constructor(headers: HttpHeaders, responseBody?: any, message = "Forbidden") {
		super(403, "Forbidden", headers, responseBody, message);
	}
}

/**
 * 404 Not Found
 */
export class NotFoundError extends HttpStatusError {
	constructor(headers: HttpHeaders, responseBody?: any, message = "Not Found") {
		super(404, "Not Found", headers, responseBody, message);
	}
}

/**
 * 405 Method Not Allowed
 */
export class MethodNotAllowedError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Method Not Allowed",
	) {
		super(405, "Method Not Allowed", headers, responseBody, message);
	}
}

/**
 * 406 Not Acceptable
 */
export class NotAcceptableError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Not Acceptable",
	) {
		super(406, "Not Acceptable", headers, responseBody, message);
	}
}

/**
 * 407 Proxy Authentication Required
 */
export class ProxyAuthenticationRequiredError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Proxy Authentication Required",
	) {
		super(407, "Proxy Authentication Required", headers, responseBody, message);
	}
}

/**
 * 408 Request Timeout
 */
export class RequestTimeoutError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Request Timeout",
	) {
		super(408, "Request Timeout", headers, responseBody, message);
	}
}

/**
 * 409 Conflict
 */
export class ConflictError extends HttpStatusError {
	constructor(headers: HttpHeaders, responseBody?: any, message = "Conflict") {
		super(409, "Conflict", headers, responseBody, message);
	}
}

/**
 * 410 Gone
 */
export class GoneError extends HttpStatusError {
	constructor(headers: HttpHeaders, responseBody?: any, message = "Gone") {
		super(410, "Gone", headers, responseBody, message);
	}
}

/**
 * 411 Length Required
 */
export class LengthRequiredError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Length Required",
	) {
		super(411, "Length Required", headers, responseBody, message);
	}
}

/**
 * 412 Precondition Failed
 */
export class PreconditionFailedError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Precondition Failed",
	) {
		super(412, "Precondition Failed", headers, responseBody, message);
	}
}

/**
 * 413 Payload Too Large
 */
export class PayloadTooLargeError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Payload Too Large",
	) {
		super(413, "Payload Too Large", headers, responseBody, message);
	}
}

/**
 * 414 URI Too Long
 */
export class URITooLongError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "URI Too Long",
	) {
		super(414, "URI Too Long", headers, responseBody, message);
	}
}

/**
 * 415 Unsupported Media Type
 */
export class UnsupportedMediaTypeError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Unsupported Media Type",
	) {
		super(415, "Unsupported Media Type", headers, responseBody, message);
	}
}

/**
 * 416 Range Not Satisfiable
 */
export class RangeNotSatisfiableError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Range Not Satisfiable",
	) {
		super(416, "Range Not Satisfiable", headers, responseBody, message);
	}
}

/**
 * 417 Expectation Failed
 */
export class ExpectationFailedError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Expectation Failed",
	) {
		super(417, "Expectation Failed", headers, responseBody, message);
	}
}

/**
 * 418 I'm a teapot
 */
export class ImATeapotError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		// eslint-disable-next-line quotes
		message = "I'm a teapot",
	) {
		// eslint-disable-next-line quotes
		super(418, "I'm a teapot", headers, responseBody, message);
	}
}

/**
 * 421 Misdirected Request
 */
export class MisdirectedRequestError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Misdirected Request",
	) {
		super(421, "Misdirected Request", headers, responseBody, message);
	}
}

/**
 * 422 Unprocessable Entity
 */
export class UnprocessableEntityError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Unprocessable Entity",
	) {
		super(422, "Unprocessable Entity", headers, responseBody, message);
	}
}

/**
 * 423 Locked
 */
export class LockedError extends HttpStatusError {
	constructor(headers: HttpHeaders, responseBody?: any, message = "Locked") {
		super(423, "Locked", headers, responseBody, message);
	}
}

/**
 * 424 Failed Dependency
 */
export class FailedDependencyError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Failed Dependency",
	) {
		super(424, "Failed Dependency", headers, responseBody, message);
	}
}

/**
 * 425 Too Early
 */
export class TooEarlyError extends HttpStatusError {
	constructor(headers: HttpHeaders, responseBody?: any, message = "Too Early") {
		super(425, "Too Early", headers, responseBody, message);
	}
}

/**
 * 426 Upgrade Required
 */
export class UpgradeRequiredError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Upgrade Required",
	) {
		super(426, "Upgrade Required", headers, responseBody, message);
	}
}

/**
 * 428 Precondition Required
 */
export class PreconditionRequiredError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Precondition Required",
	) {
		super(428, "Precondition Required", headers, responseBody, message);
	}
}

/**
 * 429 Too Many Requests
 */
export class TooManyRequestsError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Too Many Requests",
	) {
		super(429, "Too Many Requests", headers, responseBody, message);
	}
}

/**
 * 431 Request Header Fields Too Large
 */
export class RequestHeaderFieldsTooLargeError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Request Header Fields Too Large",
	) {
		super(
			431,
			"Request Header Fields Too Large",
			headers,
			responseBody,
			message,
		);
	}
}

/**
 * 451 Unavailable For Legal Reasons
 */
export class UnavailableForLegalReasonsError extends HttpStatusError {
	constructor(
		headers: HttpHeaders,
		responseBody?: any,
		message = "Unavailable For Legal Reasons",
	) {
		super(451, "Unavailable For Legal Reasons", headers, responseBody, message);
	}
}
