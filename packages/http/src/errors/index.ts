// Export base error
export { HttpError } from "./base";
// Export client errors (4xx)
export {
	BadRequestError,
	ConflictError,
	ExpectationFailedError,
	FailedDependencyError,
	ForbiddenError,
	GoneError,
	ImATeapotError,
	LengthRequiredError,
	LockedError,
	MethodNotAllowedError,
	MisdirectedRequestError,
	NotAcceptableError,
	NotFoundError,
	PayloadTooLargeError,
	PaymentRequiredError,
	PreconditionFailedError,
	PreconditionRequiredError,
	ProxyAuthenticationRequiredError,
	RangeNotSatisfiableError,
	RequestHeaderFieldsTooLargeError,
	RequestTimeoutError,
	TooEarlyError,
	TooManyRequestsError,
	UnauthorizedError,
	UnavailableForLegalReasonsError,
	UnprocessableEntityError,
	UnsupportedMediaTypeError,
	UpgradeRequiredError,
	URITooLongError,
} from "./client";
// Export general errors
export { AbortError, NetworkError, ParseError, TimeoutError } from "./general";
// Export server errors (5xx)
export {
	BadGatewayError,
	GatewayTimeoutError,
	HTTPVersionNotSupportedError,
	InsufficientStorageError,
	InternalServerError,
	LoopDetectedError,
	NetworkAuthenticationRequiredError,
	NotExtendedError,
	NotImplementedError,
	ServerError,
	ServiceUnavailableError,
	VariantAlsoNegotiatesError,
} from "./server";
// Export base status error
export { HttpStatusError } from "./status";
