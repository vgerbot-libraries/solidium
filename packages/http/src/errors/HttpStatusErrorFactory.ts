/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpHeaders } from '../http/HttpHeaders';
import {
    BadGatewayError,
    BadRequestError,
    ConflictError,
    ExpectationFailedError,
    FailedDependencyError,
    ForbiddenError,
    GatewayTimeoutError,
    GoneError,
    HTTPVersionNotSupportedError,
    HttpStatusError,
    ImATeapotError,
    InsufficientStorageError,
    InternalServerError,
    LengthRequiredError,
    LockedError,
    LoopDetectedError,
    MethodNotAllowedError,
    MisdirectedRequestError,
    NetworkAuthenticationRequiredError,
    NotAcceptableError,
    NotExtendedError,
    NotFoundError,
    NotImplementedError,
    PayloadTooLargeError,
    PaymentRequiredError,
    PreconditionFailedError,
    PreconditionRequiredError,
    ProxyAuthenticationRequiredError,
    RangeNotSatisfiableError,
    RequestHeaderFieldsTooLargeError,
    RequestTimeoutError,
    ServerError,
    ServiceUnavailableError,
    TooEarlyError,
    TooManyRequestsError,
    URITooLongError,
    UnauthorizedError,
    UnavailableForLegalReasonsError,
    UnprocessableEntityError,
    UnsupportedMediaTypeError,
    UpgradeRequiredError,
    VariantAlsoNegotiatesError
} from './index';

/**
 * Type for HTTP error class constructors
 */
type HttpErrorConstructor = new (
    headers: HttpHeaders,
    responseBody?: any,
    message?: string
) => HttpStatusError;

/**
 * Factory for creating HTTP status error instances
 */
export const HttpStatusErrorFactory = {
    // Map of status codes to error class constructors
    errorMap: new Map<number, HttpErrorConstructor>([
        // Client errors (4xx)
        [400, BadRequestError],
        [401, UnauthorizedError],
        [402, PaymentRequiredError],
        [403, ForbiddenError],
        [404, NotFoundError],
        [405, MethodNotAllowedError],
        [406, NotAcceptableError],
        [407, ProxyAuthenticationRequiredError],
        [408, RequestTimeoutError],
        [409, ConflictError],
        [410, GoneError],
        [411, LengthRequiredError],
        [412, PreconditionFailedError],
        [413, PayloadTooLargeError],
        [414, URITooLongError],
        [415, UnsupportedMediaTypeError],
        [416, RangeNotSatisfiableError],
        [417, ExpectationFailedError],
        [418, ImATeapotError],
        [421, MisdirectedRequestError],
        [422, UnprocessableEntityError],
        [423, LockedError],
        [424, FailedDependencyError],
        [425, TooEarlyError],
        [426, UpgradeRequiredError],
        [428, PreconditionRequiredError],
        [429, TooManyRequestsError],
        [431, RequestHeaderFieldsTooLargeError],
        [451, UnavailableForLegalReasonsError],

        // Server errors (5xx)
        [500, InternalServerError],
        [501, NotImplementedError],
        [502, BadGatewayError],
        [503, ServiceUnavailableError],
        [504, GatewayTimeoutError],
        [505, HTTPVersionNotSupportedError],
        [506, VariantAlsoNegotiatesError],
        [507, InsufficientStorageError],
        [508, LoopDetectedError],
        [510, NotExtendedError],
        [511, NetworkAuthenticationRequiredError]
    ]),

    /**
     * Create an appropriate HTTP status error instance based on the status code
     *
     * @param status HTTP status code
     * @param method HTTP method
     * @param headers HTTP headers
     * @param responseBody Response body
     * @returns An instance of the appropriate HTTP status error class
     */
    createError(
        status: number,
        method: string,
        headers: HttpHeaders,
        responseBody?: any
    ): HttpStatusError {
        // Look up the error class in the map
        const ErrorClass = this.errorMap.get(status);

        if (ErrorClass) {
            return new ErrorClass(headers, responseBody);
        }

        // Handle server errors not in the map
        if (status >= 500) {
            return new ServerError(status, method, headers, responseBody);
        }

        // Generic HTTP status error for other codes
        return new HttpStatusError(status, method, headers, responseBody);
    }
};
