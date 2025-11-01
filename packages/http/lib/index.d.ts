import { ApplicationContext } from '@vgerbot/ioc';
import * as rxjs from 'rxjs';
import { ReplaySubject, Observer } from 'rxjs';

declare class Progress {
    readonly total: number;
    readonly loaded: number;
    readonly chunk?: Uint8Array | undefined;
    constructor(total: number, loaded: number, chunk?: Uint8Array | undefined);
    percent(suffix?: string, fractionDigits?: number): string;
}

type ProgressHandler = (progress: Progress) => void;

interface ByteStream {
    total(): Promise<number>;
    onProgress(handler: ProgressHandler): () => void;
    readAsBuffer(): Promise<ArrayBuffer>;
    readAsStream(): ReadableStream<ArrayBuffer>;
    readAsBlob(contentType?: string): Promise<Blob>;
}

/**
 * Represents a cookie item (currently not widely used in the library).
 * @internal
 */
interface CookieItem {
    name: string;
    value: string;
    expireAt?: number;
    path?: string;
}
/**
 * Manages HTTP headers with support for multiple values per header name.
 *
 * This class provides a convenient API for working with HTTP headers, supporting:
 * - Multiple values for the same header name
 * - Conversion to/from native `Headers` object
 * - Header merging and concatenation
 * - JSON serialization
 *
 * Unlike the native `Headers` class, this implementation:
 * - Stores values as arrays, allowing explicit multiple values
 * - Provides a fluent, chainable API
 * - Supports various initialization formats
 *
 * @example
 * Creating headers:
 * ```typescript
 * const headers = new HttpHeaders();
 * headers.set('Content-Type', 'application/json');
 * headers.set('Accept', 'application/json', 'text/plain');
 * ```
 *
 * @example
 * From object:
 * ```typescript
 * const headers = new HttpHeaders({
 *   'Content-Type': 'application/json',
 *   'Accept': ['application/json', 'text/plain']
 * });
 * ```
 *
 * @example
 * Merging headers:
 * ```typescript
 * const baseHeaders = new HttpHeaders({ 'Authorization': 'Bearer token' });
 * const requestHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
 * const combined = baseHeaders.concat(requestHeaders);
 * ```
 */
declare class HttpHeaders {
    private readonly headers;
    constructor(init?: Headers | Record<string, string[]> | Map<string, string[]>);
    set(name: string, ...values: string[]): void;
    setAll(headers: Record<string, string | string[]> | Map<string, string | string[]> | Headers): void;
    append(name: string, ...values: string[]): void;
    get(name: string): string[] | undefined;
    delete(name: string): void;
    has(name: string): boolean;
    concat(other: HttpHeaders): HttpHeaders;
    forEach(callback: (key: string, value: string[]) => void): void;
    toNative(): Headers;
    [Symbol.iterator](): MapIterator<[string, string[]]>;
    [Symbol.toStringTag](): string;
    clone(): HttpHeaders;
    toJSON(): Record<string, string[]>;
    clear(): void;
    getContentLength(): number;
}

interface HttpSource {
    status(): Promise<number>;
    headers(): Promise<HttpHeaders>;
    body(): Promise<ByteStream>;
    onDownload(listener: ProgressHandler): () => void;
    onUpload(listener: ProgressHandler): () => void;
    onBodyComplete(listener: (body: ByteStream) => void): () => void;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH';

interface ExecuteRequestMethodParams {
    readonly method: HttpMethod;
    readonly signal?: AbortSignal;
    readonly headers: HttpHeaders;
    readonly pathVariables: Record<string, string | number | boolean>;
    readonly queryParams: URLSearchParams;
    payload?: BodyInit;
    adapter?: RequestAdapterConstructor;
    args: unknown[];
    /**
     * When true, indicates that the request should bypass cache
     */
    force?: boolean;
}

/**
 * Initialization options for creating an {@link HttpResponse}.
 */
interface HttpResponseInit {
    /** The request method that generated this response */
    method: RequestMethod;
}
/**
 * Represents an HTTP response with utilities for parsing and streaming data.
 *
 * This class wraps the low-level {@link HttpSource} and provides convenient
 * methods for accessing response data in various formats:
 * - Plain text (`text()`)
 * - JSON (`json()`)
 * - Streaming text (`textStream()`)
 * - Streaming JSON/SSE (`jsonStream()`)
 * - Raw byte stream (`body()`)
 *
 * It also provides access to:
 * - Response status code
 * - Response headers
 * - Upload/download progress tracking
 *
 * Instances are typically created automatically by the framework and accessed
 * through the Resource abstraction or interceptors.
 *
 * @example
 * Accessing response in an interceptor:
 * ```typescript
 * class LoggingInterceptor implements Interceptor {
 *   async invoke(instance, method, params, next) {
 *     const response = await next(instance, method, params);
 *     const status = await response.status();
 *     const headers = await response.headers();
 *     console.log(`Response ${status}:`, headers.toJSON());
 *     return response;
 *   }
 * }
 * ```
 *
 * @example
 * Creating a response manually (e.g., for testing):
 * ```typescript
 * const response = HttpResponse.of(
 *   Promise.resolve(new BlobByteStream(new Blob(['{"data": "value"}']))),
 *   new HttpHeaders({ 'Content-Type': 'application/json' }),
 *   200,
 *   method
 * );
 *
 * const data = await response.json();
 * ```
 */
declare class HttpResponse implements HttpSource {
    private readonly source;
    readonly init: HttpResponseInit;
    static of(body: Promise<ByteStream>, headers: HttpHeaders, status: number, method: RequestMethod): HttpResponse;
    constructor(source: HttpSource, init: HttpResponseInit);
    status(): Promise<number>;
    headers(): Promise<HttpHeaders>;
    body(): Promise<ByteStream>;
    text(encoding?: string): Promise<string>;
    json<T>(): Promise<T>;
    textStream(encoding?: string): AsyncGenerator<string, void, unknown>;
    jsonStream<T>(encoding?: string): AsyncGenerator<Awaited<T>, void, unknown>;
    onUpload(listener: ProgressHandler): () => void;
    onDownload(listener: ProgressHandler): () => void;
    onBodyComplete(listener: (body: ByteStream) => void): () => void;
}

/**
 * Base class for all HTTP-related errors in the library.
 *
 * This abstract class serves as the foundation for all HTTP error types, including:
 * - Network errors (timeouts, connection failures, aborts)
 * - HTTP status errors (4xx, 5xx)
 * - Parse errors (invalid JSON, etc.)
 * - Custom application errors
 *
 * All HTTP errors extend this base class, making it easy to catch and handle
 * any HTTP-related error with a single catch block.
 *
 * The library provides specific error classes for:
 * - **General Errors**: {@link TimeoutError}, {@link NetworkError}, {@link AbortError}, {@link ParseError}
 * - **Status Errors**: {@link HttpStatusError} and its subclasses
 * - **Client Errors (4xx)**: {@link BadRequestError}, {@link UnauthorizedError}, {@link NotFoundError}, etc.
 * - **Server Errors (5xx)**: {@link InternalServerError}, {@link ServiceUnavailableError}, etc.
 *
 * @example
 * Catching all HTTP errors:
 * ```typescript
 * try {
 *   const resource = api.getData();
 *   await resource.wait();
 * } catch (error) {
 *   if (error instanceof HttpError) {
 *     console.error('HTTP error occurred:', error.message);
 *     if (error.cause) {
 *       console.error('Caused by:', error.cause);
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * Handling specific error types:
 * ```typescript
 * try {
 *   await api.getData().wait();
 * } catch (error) {
 *   if (error instanceof TimeoutError) {
 *     console.error('Request timed out');
 *   } else if (error instanceof UnauthorizedError) {
 *     // Redirect to login
 *   } else if (error instanceof NotFoundError) {
 *     // Show 404 page
 *   } else if (error instanceof HttpStatusError) {
 *     // Handle other HTTP status errors
 *     console.error(`HTTP ${error.status}: ${error.message}`);
 *   }
 * }
 * ```
 *
 * @example
 * Custom error handling in interceptor:
 * ```typescript
 * class ErrorHandlerInterceptor implements Interceptor {
 *   async invoke(instance, method, params, next) {
 *     try {
 *       return await next(instance, method, params);
 *     } catch (error) {
 *       if (error instanceof HttpError) {
 *         // Log to error tracking service
 *         errorTracker.captureException(error);
 *       }
 *       throw error;
 *     }
 *   }
 * }
 * ```
 */
declare abstract class HttpError extends Error {
    readonly cause?: Error | undefined;
    /**
     * Creates a new HTTP error.
     *
     * @param message - Human-readable error message
     * @param cause - Optional underlying error that caused this error
     */
    constructor(message: string, cause?: Error | undefined);
}

/**
 * Error thrown when a request times out
 */
declare class TimeoutError extends HttpError {
    readonly context: Record<string, unknown>;
    constructor(message: string | undefined, context: Record<string, unknown>, cause?: Error);
}
/**
 * Error thrown when there's a network issue
 */
declare class NetworkError extends HttpError {
    constructor(message?: string, cause?: Error);
}
/**
 * Error thrown when a request is aborted
 */
declare class AbortError extends HttpError {
    constructor(message?: string, cause?: Error);
}
/**
 * Error thrown when there's an issue parsing the response
 */
declare class ParseError extends HttpError {
    constructor(message?: string, cause?: Error);
}

/**
 * Base class for HTTP status code errors
 */
declare class HttpStatusError extends HttpError {
    readonly status: number;
    readonly statusText: string;
    readonly headers: HttpHeaders;
    readonly responseBody?: any | undefined;
    constructor(status: number, statusText: string, headers: HttpHeaders, responseBody?: any | undefined, message?: string);
    /**
     * Check if this is a client error (4xx)
     */
    get isClientError(): boolean;
    /**
     * Check if this is a server error (5xx)
     */
    get isServerError(): boolean;
}

/**
 * 400 Bad Request
 */
declare class BadRequestError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 401 Unauthorized
 */
declare class UnauthorizedError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 402 Payment Required
 */
declare class PaymentRequiredError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 403 Forbidden
 */
declare class ForbiddenError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 404 Not Found
 */
declare class NotFoundError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 405 Method Not Allowed
 */
declare class MethodNotAllowedError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 406 Not Acceptable
 */
declare class NotAcceptableError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 407 Proxy Authentication Required
 */
declare class ProxyAuthenticationRequiredError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 408 Request Timeout
 */
declare class RequestTimeoutError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 409 Conflict
 */
declare class ConflictError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 410 Gone
 */
declare class GoneError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 411 Length Required
 */
declare class LengthRequiredError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 412 Precondition Failed
 */
declare class PreconditionFailedError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 413 Payload Too Large
 */
declare class PayloadTooLargeError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 414 URI Too Long
 */
declare class URITooLongError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 415 Unsupported Media Type
 */
declare class UnsupportedMediaTypeError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 416 Range Not Satisfiable
 */
declare class RangeNotSatisfiableError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 417 Expectation Failed
 */
declare class ExpectationFailedError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 418 I'm a teapot
 */
declare class ImATeapotError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 421 Misdirected Request
 */
declare class MisdirectedRequestError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 422 Unprocessable Entity
 */
declare class UnprocessableEntityError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 423 Locked
 */
declare class LockedError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 424 Failed Dependency
 */
declare class FailedDependencyError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 425 Too Early
 */
declare class TooEarlyError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 426 Upgrade Required
 */
declare class UpgradeRequiredError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 428 Precondition Required
 */
declare class PreconditionRequiredError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 429 Too Many Requests
 */
declare class TooManyRequestsError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 431 Request Header Fields Too Large
 */
declare class RequestHeaderFieldsTooLargeError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 451 Unavailable For Legal Reasons
 */
declare class UnavailableForLegalReasonsError extends HttpStatusError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}

/**
 * Base class for server errors (5xx)
 */
declare class ServerError extends HttpStatusError {
    constructor(status: number, statusText: string, headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 500 Internal Server Error
 */
declare class InternalServerError extends ServerError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 501 Not Implemented
 */
declare class NotImplementedError extends ServerError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 502 Bad Gateway
 */
declare class BadGatewayError extends ServerError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 503 Service Unavailable
 */
declare class ServiceUnavailableError extends ServerError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 504 Gateway Timeout
 */
declare class GatewayTimeoutError extends ServerError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 505 HTTP Version Not Supported
 */
declare class HTTPVersionNotSupportedError extends ServerError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 506 Variant Also Negotiates
 */
declare class VariantAlsoNegotiatesError extends ServerError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 507 Insufficient Storage
 */
declare class InsufficientStorageError extends ServerError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 508 Loop Detected
 */
declare class LoopDetectedError extends ServerError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 510 Not Extended
 */
declare class NotExtendedError extends ServerError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}
/**
 * 511 Network Authentication Required
 */
declare class NetworkAuthenticationRequiredError extends ServerError {
    constructor(headers: HttpHeaders, responseBody?: any, message?: string);
}

/**
 * Configuration options for the {@link RetryInterceptor}.
 */
interface RetryConfig {
    /** Maximum number of retry attempts before giving up */
    maxAttempts: number;
    /** Multiplier for exponential backoff (e.g., 2 doubles the delay each retry) */
    backoffFactor: number;
    /** Initial delay in milliseconds before the first retry */
    initialDelay: number;
    /** Maximum delay in milliseconds between retries (caps exponential growth) */
    maxDelay: number;
    /** HTTP status codes that should trigger a retry (e.g., [408, 500, 502, 503, 504]) */
    retryableStatuses: number[];
    /** Custom function to determine if an error should trigger a retry */
    retryable: (error: unknown) => Promise<boolean>;
}
/**
 * Interceptor that automatically retries failed HTTP requests with exponential backoff.
 *
 * This interceptor implements intelligent retry logic for transient failures such as
 * network timeouts, temporary server errors (5xx), or connection issues. It uses
 * exponential backoff to gradually increase the delay between retries, reducing
 * server load while maximizing the chance of eventual success.
 *
 * Default behavior:
 * - Retries up to 3 times
 * - Uses exponential backoff starting at 1 second, doubling each retry
 * - Caps maximum delay at 10 seconds
 * - Retries on HTTP status codes: 408 (Timeout), 500, 502, 503, 504 (Server Errors)
 *
 * @example
 * Using default retry configuration:
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   interceptors: [RetryInterceptor]
 * })
 * class API {
 *   @Get('/unstable-endpoint')
 *   getData() {
 *     return restful<Data>();
 *   }
 * }
 * // Automatically retries up to 3 times on failure
 * ```
 *
 * @example
 * Custom retry configuration:
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   interceptors: [
 *     new RetryInterceptor({
 *       maxAttempts: 5,
 *       initialDelay: 500,
 *       maxDelay: 30000,
 *       retryableStatuses: [408, 429, 500, 502, 503, 504],
 *       async retryable(error) {
 *         // Custom retry logic
 *         if (error instanceof NetworkError) return true;
 *         if (error instanceof TimeoutError) return true;
 *         return false;
 *       }
 *     })
 *   ]
 * })
 * class API { }
 * ```
 *
 * @example
 * Method-specific retry:
 * ```typescript
 * @Get('/data')
 * @Request({
 *   retry: {
 *     maxAttempts: 5,
 *     initialDelay: 2000
 *   }
 * })
 * getData() {
 *   return restful<Data>();
 * }
 * ```
 */
declare class RetryInterceptor implements Interceptor {
    private readonly config;
    constructor(config?: Partial<RetryConfig>);
    private delay;
    invoke(instance: EndpointInstance, method: RequestMethod, params: ExecuteRequestMethodParams, next: InterceptorNextFunction): Promise<HttpResponse>;
}
declare class MaxRetryAttemptsReachedError extends HttpError {
    readonly attempts: number;
    readonly originalError: unknown;
    constructor(attempts: number, originalError: unknown);
}

interface RequestOptions {
    path: string;
    method: HttpMethod;
    headers?: Record<string, string | string[]>;
    interceptors?: Array<InterceptorTypeIdentifier | Interceptor>;
    excludeInterceptors?: Array<InterceptorTypeIdentifier | Interceptor>;
    timeout?: number;
    retry?: RetryConfig;
    adapter?: RequestAdapterConstructor;
    reactive?: boolean;
}
declare function Request(options: RequestOptions): <R = any, A extends Array<any> = any[], T extends (...args: any[]) => any = (...args: A) => R>(target: unknown, context: ClassMethodDecoratorContext<object, T> | string | symbol, descriptor?: TypedPropertyDescriptor<T>) => void | TypedPropertyDescriptor<(...args: any[]) => any>;
declare function createRequestDecorator(options: string | Omit<RequestOptions, 'method'>, method: HttpMethod): <R = any, A extends Array<any> = any[], T extends (...args: any[]) => any = (...args: A) => R>(target: unknown, context: ClassMethodDecoratorContext<object, T> | string | symbol, descriptor?: TypedPropertyDescriptor<T>) => void | TypedPropertyDescriptor<(...args: any[]) => any>;

type ExecutionHandler = (instance: EndpointInstance, method: RequestMethod, params: ExecuteRequestMethodParams, args: unknown[]) => void;
declare class RequestMethodMetadata {
    readonly name: string | symbol;
    private readonly executionHandlers;
    private readonly extra;
    private readonly options;
    private readonly externalInterceptors;
    constructor(name: string | symbol);
    setOptions(options: RequestOptions): void;
    getExtra<T>(key: string | symbol): T;
    setExtra<T>(key: string | symbol, value: T): void;
    getRetryConfig(): RetryConfig | undefined;
    appendExecutionHandler(handler: ExecutionHandler): void;
    getExecutionHandlers(): ExecutionHandler[];
    getPath(): string;
    getHttpMethod(): HttpMethod;
    getHeaders(): HttpHeaders;
    getTimeout(): number;
    getInterceptors(): (Interceptor | InterceptorTypeIdentifier)[];
    getExcludeInterceptors(): (Interceptor | InterceptorTypeIdentifier)[];
    getAdapter(): RequestAdapterConstructor | undefined;
    isReactive(): boolean;
    appendInterceptor(interceptor: Interceptor | InterceptorTypeIdentifier): void;
}

interface BaseEndpointOptions {
    baseURL: string;
    path?: string;
    timeout?: number;
    headers?: Record<string, string | string[]>;
    adapter?: RequestAdapterConstructor;
    interceptors?: Array<InterceptorTypeIdentifier | Interceptor>;
}
type EndpointOptions = ({
    extends: Function;
} & Partial<BaseEndpointOptions>) | BaseEndpointOptions;
declare class EndpointMetadata {
    static from(target: Function): EndpointMetadata;
    static fromInstance(target: EndpointInstance): EndpointMetadata;
    private baseURL;
    private timeout;
    private headers;
    private readonly methods;
    private adapter?;
    private interceptors?;
    private constructor();
    setOptions(endpointOptions: EndpointOptions): void;
    getMethodMetadata(methodName: string | symbol): RequestMethodMetadata;
    setMethodMetadata(methodName: string | symbol, methodMetadata: RequestMethodMetadata): void;
    getMethods(): Map<string | symbol, RequestMethodMetadata>;
    getInterceptors(): Array<InterceptorTypeIdentifier | Interceptor>;
    getAdaptor(): RequestAdapterConstructor | undefined;
    getBaseURL(): string;
    getHeaders(): HttpHeaders;
    getTimeout(): number;
}

declare class RequestMethod {
    readonly name: string | symbol;
    readonly endpointMetadata: EndpointMetadata;
    readonly metadata: RequestMethodMetadata;
    static get(instance: EndpointInstance, name: string | symbol): RequestMethod | undefined;
    readonly url: string;
    private readonly baseInterceptors;
    constructor(name: string | symbol, endpointMetadata: EndpointMetadata, metadata: RequestMethodMetadata);
    getAllInterceptors(instance: EndpointInstance): Interceptor[];
    invoke(instance: EndpointInstance, params: ExecuteRequestMethodParams): Promise<HttpResponse>;
    resolveURL(params: ExecuteRequestMethodParams): string;
    private createAdapter;
}

interface AdapterOptions {
    invokeMethod: RequestMethod;
    method: HttpMethod;
    url: string;
    headers: HttpHeaders;
    payload: BodyInit | undefined;
    signal: AbortSignal;
}

interface RequestAdapter {
    abort(): void;
    execute(): Promise<HttpSource>;
}
type RequestAdapterConstructor = new (options: AdapterOptions) => RequestAdapter;

type Class<T> = {
    new (...args: unknown[]): T;
    prototype: T;
};

/**
 * Symbol constants used for endpoint instance storage and retrieval
 */
/** Stores HTTP methods (GET, POST, etc.) associated with an endpoint */
declare const METHODS: unique symbol;
/** Stores interceptors that process requests/responses for an endpoint */
declare const GET_INTERCEPTORS: unique symbol;
/** Stores the HTTP adapter configuration for an endpoint */
declare const ADAPTER: unique symbol;
/** Stores the interceptor construction logic for an endpoint */
declare const CONSTRUCT_INTERCEPTORS: unique symbol;
declare const ABORT_CONTROLLER$1: unique symbol;
declare const APPLICATION_CONTEXT: unique symbol;
declare const HTTP_CONFIGURATION: unique symbol;

interface HttpConfiguration {
    cacheBucket?: string;
    interceptors?: Array<InterceptorTypeIdentifier | Interceptor>;
}

interface EndpointInstance {
    [METHODS]: Map<string | symbol, RequestMethod>;
    [GET_INTERCEPTORS]: (exclude?: Array<InterceptorTypeIdentifier | Interceptor>) => Interceptor[];
    [ADAPTER]?: RequestAdapterConstructor;
    [CONSTRUCT_INTERCEPTORS]: (interceptors: Array<InterceptorTypeIdentifier | Interceptor>) => Interceptor[];
    [ABORT_CONTROLLER$1]: AbortController;
    [APPLICATION_CONTEXT]: ApplicationContext;
    [HTTP_CONFIGURATION]?: HttpConfiguration;
}
declare function buildEndpointClass(endpointClass: Class<EndpointInstance>, metadata: EndpointMetadata): void;

/**
 * Interface for HTTP request/response interceptors.
 *
 * Interceptors provide a way to inspect and modify HTTP requests and responses
 * in a middleware-like pattern. They form a chain where each interceptor can:
 * - Modify request parameters before sending
 * - Handle the response or error
 * - Short-circuit the chain by not calling `next`
 * - Wrap the request with additional logic (retries, timeouts, caching, etc.)
 *
 * Common use cases:
 * - Request/response logging
 * - Authentication token injection
 * - Error handling and retry logic
 * - Request/response caching
 * - Timeout enforcement
 * - Circuit breaker pattern
 *
 * @example
 * Logging interceptor:
 * ```typescript
 * class LoggingInterceptor implements Interceptor {
 *   async invoke(instance, method, params, next) {
 *     console.log('Request:', method.name, params);
 *     const start = Date.now();
 *
 *     try {
 *       const response = await next(instance, method, params);
 *       console.log('Response:', Date.now() - start, 'ms');
 *       return response;
 *     } catch (error) {
 *       console.error('Error:', error);
 *       throw error;
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * Auth token interceptor:
 * ```typescript
 * class AuthInterceptor implements Interceptor {
 *   constructor(private getToken: () => string) {}
 *
 *   async invoke(instance, method, params, next) {
 *     const token = this.getToken();
 *     params.headers.set('Authorization', `Bearer ${token}`);
 *     return next(instance, method, params);
 *   }
 * }
 * ```
 */
interface Interceptor {
    /**
     * Invokes the interceptor in the request/response chain.
     *
     * @param instance - The endpoint instance making the request
     * @param method - The request method being invoked
     * @param params - The request parameters (can be modified)
     * @param next - Function to call the next interceptor or the actual request
     * @returns Promise resolving to the HTTP response
     */
    invoke(instance: EndpointInstance, method: RequestMethod, params: ExecuteRequestMethodParams, next: InterceptorNextFunction): Promise<HttpResponse>;
}
type InterceptorConstructor = new () => Interceptor;
type InterceptorNextFunction = (instance: EndpointInstance, method: RequestMethod, params: ExecuteRequestMethodParams) => Promise<HttpResponse>;
declare function isInterceptorConstructor(value: unknown): value is InterceptorConstructor;
declare function isInterceptor(value: unknown): value is Interceptor;
type InterceptorTypeIdentifier = InterceptorConstructor | string | symbol;

/**
 * Configuration options for the {@link CircuitBreakerInterceptor}.
 */
interface CircuitBreakerConfig {
    /** Number of consecutive failures before opening the circuit */
    threshold: number;
    /** Time in milliseconds before attempting to close the circuit (transition to HALF_OPEN) */
    resetTimeout: number;
}
/**
 * Circuit breaker state.
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Circuit is open, requests fail immediately
 * - HALF_OPEN: Testing if service recovered, allows one request through
 */
type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';
/**
 * Interceptor implementing the Circuit Breaker pattern to prevent cascading failures.
 *
 * The Circuit Breaker pattern protects your application from repeatedly trying to execute
 * an operation that's likely to fail. When failures reach a threshold, the circuit "opens"
 * and subsequent requests fail immediately without attempting the actual call. After a
 * timeout period, the circuit enters a "half-open" state to test if the service has recovered.
 *
 * Circuit States:
 * - **CLOSED**: Normal operation. Requests pass through. Failures are counted.
 * - **OPEN**: Too many failures occurred. Requests fail immediately with {@link CircuitBreakerError}.
 * - **HALF_OPEN**: Testing recovery. One request is allowed through. Success closes the circuit,
 *   failure reopens it.
 *
 * Default behavior:
 * - Opens circuit after 5 consecutive failures
 * - Attempts to reset after 60 seconds
 *
 * This pattern is essential for:
 * - Preventing resource exhaustion from repeated failed requests
 * - Allowing failing services time to recover
 * - Failing fast instead of blocking threads/resources
 * - Improving overall system resilience
 *
 * @example
 * Basic usage with default configuration:
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   interceptors: [CircuitBreakerInterceptor]
 * })
 * class API {
 *   @Get('/flaky-service')
 *   getData() {
 *     return restful<Data>();
 *   }
 * }
 *
 * // After 5 failures, subsequent calls fail immediately for 60 seconds
 * ```
 *
 * @example
 * Custom configuration:
 * ```typescript
 * const customCircuitBreaker = CircuitBreakerInterceptor.of({
 *   threshold: 3,        // Open after 3 failures
 *   resetTimeout: 30000  // Try again after 30 seconds
 * });
 *
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   interceptors: [customCircuitBreaker]
 * })
 * class API { }
 * ```
 *
 * @example
 * Handling circuit breaker errors:
 * ```typescript
 * try {
 *   const resource = api.getData();
 *   await resource.wait();
 * } catch (error) {
 *   if (error instanceof CircuitBreakerError) {
 *     console.log('Service temporarily unavailable');
 *     // Show cached data or fallback UI
 *   }
 * }
 * ```
 */
declare class CircuitBreakerInterceptor implements Interceptor {
    protected failures: number;
    protected lastFailureTime: number;
    protected state: CircuitState;
    protected readonly config: CircuitBreakerConfig;
    static of(config?: Partial<CircuitBreakerConfig>): InterceptorConstructor;
    constructor(config?: Partial<CircuitBreakerConfig>);
    private shouldReset;
    invoke(instance: EndpointInstance, method: RequestMethod, params: ExecuteRequestMethodParams, next: InterceptorNextFunction): Promise<HttpResponse>;
}
declare class CircuitBreakerError extends HttpError {
    constructor(message?: string);
}

/**
 * Configuration options for the {@link TimeoutInterceptor}.
 */
interface TimeoutConfig {
    /** Timeout duration in milliseconds */
    timeout: number;
}
/**
 * Interceptor that enforces a timeout on HTTP requests.
 *
 * This interceptor automatically aborts requests that take longer than the specified
 * timeout duration, preventing requests from hanging indefinitely. It's essential for
 * maintaining application responsiveness and resource management.
 *
 * The timeout is implemented using AbortController, which properly cancels the underlying
 * network request rather than just ignoring the response.
 *
 * Default behavior:
 * - Timeout after 30 seconds
 * - Throws {@link TimeoutError} when timeout is reached
 * - Properly aborts the underlying request
 *
 * @example
 * Global timeout for all endpoints:
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   timeout: 10000  // 10 seconds
 * })
 * class API {
 *   @Get('/data')
 *   getData() {
 *     return restful<Data>();
 *   }
 * }
 * ```
 *
 * @example
 * Method-specific timeout:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class API {
 *   @Get('/fast-endpoint')
 *   @Request({ timeout: 5000 })  // 5 seconds
 *   getFastData() {
 *     return restful<Data>();
 *   }
 *
 *   @Get('/slow-endpoint')
 *   @Request({ timeout: 60000 })  // 60 seconds
 *   getSlowData() {
 *     return restful<Data>();
 *   }
 * }
 * ```
 *
 * @example
 * Handling timeout errors:
 * ```typescript
 * const resource = api.getData();
 *
 * try {
 *   await resource.wait();
 * } catch (error) {
 *   if (error instanceof TimeoutError) {
 *     console.error('Request timed out after', error.context.timeout, 'ms');
 *     // Show timeout message to user
 *   }
 * }
 * ```
 *
 * @example
 * Disable timeout for specific request:
 * ```typescript
 * @Get('/long-running-task')
 * @Request({ timeout: 0 })  // No timeout
 * startLongTask() {
 *   return restful<Task>();
 * }
 * ```
 */
declare class TimeoutInterceptor implements Interceptor {
    private readonly config;
    constructor(config?: Partial<TimeoutConfig>);
    invoke(instance: EndpointInstance, method: RequestMethod, params: ExecuteRequestMethodParams, next: InterceptorNextFunction): Promise<HttpResponse>;
}

declare class ErrorContextInterceptor implements Interceptor {
    invoke(instance: EndpointInstance, method: RequestMethod, params: ExecuteRequestMethodParams, next: InterceptorNextFunction): Promise<HttpResponse>;
}

declare class FetchRequestAdapter implements RequestAdapter {
    private executeRequestIfNeed;
    private readonly events;
    private readonly headersDefer;
    private readonly bodyDefer;
    private readonly statusDefer;
    private readonly abortController;
    constructor(options: AdapterOptions);
    abort(): void;
    execute(): Promise<HttpSource>;
}

declare class XMLHttpRequestAdapter implements RequestAdapter {
    private readonly xhr;
    private executeRequestIfNeed;
    private readonly events;
    private readonly headersDefer;
    private readonly bodyDefer;
    private readonly statusDefer;
    private isAborted;
    constructor(options: AdapterOptions);
    abort(): void;
    execute(): Promise<HttpSource>;
}

declare enum PromiseStatus {
    PENDING = "pending",
    FULFILLED = "fulfilled",
    REJECTED = "rejected"
}
declare const STATUS: unique symbol;
declare const FULFILLED_VALUE: unique symbol;
declare const REJECTED_REASON: unique symbol;
declare const ABORT_CONTROLLER: unique symbol;
declare class Defer<T> {
    static resolve<T>(value: T | PromiseLike<T>): Defer<T>;
    static reject<T>(reason: unknown): Defer<T>;
    static fromArray<T>(array: ArrayLike<T | PromiseLike<T>>, mapfn?: (value: T | PromiseLike<T>) => Promise<T>): Defer<T[]>;
    static serial(array: ArrayLike<() => void | PromiseLike<void>>): Promise<void>;
    readonly promise: Promise<T>;
    readonly resolve: (value: T | PromiseLike<T>) => void;
    readonly reject: (reason?: unknown) => void;
    private [STATUS];
    private [FULFILLED_VALUE]?;
    private [REJECTED_REASON]?;
    private [ABORT_CONTROLLER];
    get status(): PromiseStatus;
    get isSettled(): boolean;
    get fullfilledValue(): T | undefined;
    get rejectedReason(): unknown;
    get isCancelled(): boolean;
    get signal(): AbortSignal;
    constructor();
    abort(message?: string): void;
    invokeOnCompletion(completionHandler: CompletionHandler<T>): typeof noop;
}
type DisposableHandler = () => void;
type CompletionHandler<T> = (this: Defer<T>, reason?: unknown) => DisposableHandler;
declare class CancellationError extends Error {
    constructor(message?: string);
}
declare function noop(): void;

type EventListener = (...args: any[]) => void;
declare class Events {
    private readonly listeners;
    on(event: string, listener: EventListener): () => void;
    emit(event: string, ...args: unknown[]): void;
}

declare function isURL(text: string): boolean;

declare function joinPath(...paths: string[]): string;

declare function mergeAbortSignal(...signals: (AbortSignal | undefined)[]): AbortSignal;

declare function parseHeaders(rawHeaders: string): Map<string, string[]>;

declare function resolveURL(routeTemplate: string, pathVariables: Record<string, string | number | boolean>, queryParameters: URLSearchParams): string;

/**
 * Decorator that marks a class as an HTTP endpoint and configures its base settings.
 *
 * Use this decorator to define a class that represents a collection of related HTTP API endpoints.
 * It configures the base URL, common headers, interceptors, and other settings that apply to all
 * methods within the class.
 *
 * @param options - Configuration options for the endpoint
 * @param options.baseURL - The base URL for all HTTP requests in this endpoint
 * @param options.path - Optional path segment to append to the base URL
 * @param options.timeout - Optional default timeout in milliseconds for all requests
 * @param options.headers - Optional default headers to include in all requests
 * @param options.adapter - Optional custom adapter for making HTTP requests
 * @param options.interceptors - Optional array of interceptors to apply to all requests
 * @param options.extends - Optional parent endpoint class to inherit configuration from
 *
 * @example
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   path: '/v1/users',
 *   headers: {
 *     'Authorization': 'Bearer token'
 *   }
 * })
 * class UserAPI {
 *   @Get('/{id}')
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 * ```
 *
 * @example
 * Extending another endpoint:
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com'
 * })
 * class BaseAPI {}
 *
 * @Endpoint({
 *   extends: BaseAPI,
 *   path: '/users'
 * })
 * class UserAPI extends BaseAPI {
 *   // Methods here...
 * }
 * ```
 *
 * @returns A class decorator
 */
declare function Endpoint(options: EndpointOptions): ClassDecorator;

/**
 * Options for configuring a GET request, excluding the HTTP method.
 */
type GetRequestOptions = Omit<RequestOptions, 'method'>;
/**
 * Decorator that marks a method as an HTTP GET request handler.
 *
 * Use this decorator to define a method that performs an HTTP GET request.
 * GET requests are typically used to retrieve data from the server.
 *
 * @param options - Either a string path or a configuration object
 * @param options.path - The URL path for the request (can include path variables like `{id}`)
 * @param options.headers - Optional headers to include in the request
 * @param options.interceptors - Optional interceptors to apply to this specific request
 * @param options.excludeInterceptors - Optional interceptors to exclude from this request
 * @param options.timeout - Optional timeout in milliseconds for this request
 * @param options.retry - Optional retry configuration for failed requests
 * @param options.adapter - Optional custom adapter for this request
 *
 * @example
 * Simple usage with path string:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 * ```
 *
 * @example
 * Advanced usage with options:
 * ```typescript
 * @Get({
 *   path: '/users/{id}',
 *   timeout: 5000,
 *   headers: { 'Accept': 'application/json' },
 *   retry: { maxAttempts: 3 }
 * })
 * getUser(@PathVariable('id') id: string) {
 *   return restful<User>(id);
 * }
 * ```
 *
 * @returns A method decorator
 */
declare function Get(options: string | GetRequestOptions): <R = any, A extends Array<any> = any[], T extends (...args: any[]) => any = (...args: A) => R>(target: unknown, context: ClassMethodDecoratorContext<object, T> | string | symbol, descriptor?: TypedPropertyDescriptor<T>) => void | TypedPropertyDescriptor<(...args: any[]) => any>;

/**
 * Options for configuring a POST request, excluding the HTTP method.
 */
type PostRequestOptions = Omit<RequestOptions, 'method'>;
/**
 * Decorator that marks a method as an HTTP POST request handler.
 *
 * Use this decorator to define a method that performs an HTTP POST request.
 * POST requests are typically used to create new resources or submit data to the server.
 *
 * @param options - Either a string path or a configuration object
 * @param options.path - The URL path for the request
 * @param options.headers - Optional headers to include in the request
 * @param options.interceptors - Optional interceptors to apply to this specific request
 * @param options.timeout - Optional timeout in milliseconds for this request
 * @param options.retry - Optional retry configuration for failed requests
 *
 * @example
 * Creating a new user:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Post('/users')
 *   createUser(@Payload() user: CreateUserDto) {
 *     return restful<User>(user);
 *   }
 * }
 * ```
 *
 * @example
 * With custom headers:
 * ```typescript
 * @Post({
 *   path: '/users',
 *   headers: { 'Content-Type': 'application/json' }
 * })
 * createUser(@Payload() user: CreateUserDto) {
 *   return restful<User>(user);
 * }
 * ```
 *
 * @returns A method decorator
 */
declare function Post(options: string | PostRequestOptions): <R = any, A extends Array<any> = any[], T extends (...args: any[]) => any = (...args: A) => R>(target: unknown, context: ClassMethodDecoratorContext<object, T> | string | symbol, descriptor?: TypedPropertyDescriptor<T>) => void | TypedPropertyDescriptor<(...args: any[]) => any>;

/**
 * Options for configuring a PUT request, excluding the HTTP method.
 */
type PutRequestOptions = Omit<RequestOptions, 'method'>;
/**
 * Decorator that marks a method as an HTTP PUT request handler.
 *
 * Use this decorator to define a method that performs an HTTP PUT request.
 * PUT requests are typically used to update existing resources on the server.
 *
 * @param options - Either a string path or a configuration object
 * @param options.path - The URL path for the request (can include path variables)
 * @param options.headers - Optional headers to include in the request
 * @param options.interceptors - Optional interceptors to apply to this specific request
 * @param options.timeout - Optional timeout in milliseconds for this request
 *
 * @example
 * Updating a user:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Put('/users/{id}')
 *   updateUser(
 *     @PathVariable('id') id: string,
 *     @Payload() user: UpdateUserDto
 *   ) {
 *     return restful<User>(id, user);
 *   }
 * }
 * ```
 *
 * @returns A method decorator
 */
declare function Put(options: string | PutRequestOptions): <R = any, A extends Array<any> = any[], T extends (...args: any[]) => any = (...args: A) => R>(target: unknown, context: ClassMethodDecoratorContext<object, T> | string | symbol, descriptor?: TypedPropertyDescriptor<T>) => void | TypedPropertyDescriptor<(...args: any[]) => any>;

/**
 * Options for configuring a DELETE request, excluding the HTTP method.
 */
type DeleteRequestOptions = Omit<RequestOptions, 'method'>;
/**
 * Decorator that marks a method as an HTTP DELETE request handler.
 *
 * Use this decorator to define a method that performs an HTTP DELETE request.
 * DELETE requests are typically used to remove resources from the server.
 *
 * @param options - Either a string path or a configuration object
 * @param options.path - The URL path for the request (can include path variables)
 * @param options.headers - Optional headers to include in the request
 * @param options.interceptors - Optional interceptors to apply to this specific request
 * @param options.timeout - Optional timeout in milliseconds for this request
 *
 * @example
 * Deleting a user:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Delete('/users/{id}')
 *   deleteUser(@PathVariable('id') id: string) {
 *     return restful<void>(id);
 *   }
 * }
 * ```
 *
 * @returns A method decorator
 */
declare function Delete(options: string | DeleteRequestOptions): <R = any, A extends Array<any> = any[], T extends (...args: any[]) => any = (...args: A) => R>(target: unknown, context: ClassMethodDecoratorContext<object, T> | string | symbol, descriptor?: TypedPropertyDescriptor<T>) => void | TypedPropertyDescriptor<(...args: any[]) => any>;

/**
 * Parameter decorator that binds a method parameter to an HTTP request header.
 *
 * Use this decorator to dynamically set HTTP headers based on method parameters.
 * This is useful for headers that vary per request, such as authorization tokens,
 * custom API keys, or content negotiation headers.
 *
 * @param name - The name of the HTTP header (e.g., 'Authorization', 'X-API-Key')
 * @param defaultValue - Optional default value(s) to use if the parameter is undefined
 *
 * @example
 * Dynamic authorization header:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   getUser(
 *     @PathVariable('id') id: string,
 *     @Header('Authorization') token: string
 *   ) {
 *     return restful<User>(id, token);
 *   }
 * }
 *
 * // Usage:
 * api.getUser('123', 'Bearer abc123');
 * // GET /users/123
 * // Authorization: Bearer abc123
 * ```
 *
 * @example
 * With default value:
 * ```typescript
 * @Get('/data')
 * getData(
 *   @Header('Accept', 'application/json') accept?: string
 * ) {
 *   return restful<Data>(accept);
 * }
 * ```
 *
 * @example
 * Multiple header values:
 * ```typescript
 * @Get('/data')
 * getData(
 *   @Header('Accept') acceptTypes: string[]
 * ) {
 *   return restful<Data>(acceptTypes);
 * }
 *
 * // Usage:
 * api.getData(['application/json', 'application/xml']);
 * ```
 *
 * @returns A parameter decorator
 */
declare function Header(name: string, defaultValue?: string | string[]): (target: object, methodName: string, parameterIndex: number) => void;

/**
 * Parameter decorator that binds a method parameter to a path variable in the URL.
 *
 * Use this decorator to extract values from URL path segments (e.g., `/users/{id}`).
 * The decorated parameter value will replace the corresponding placeholder in the path.
 *
 * @param name - The name of the path variable in the URL template (e.g., 'id' for '/users/{id}')
 * @param defaultValue - Optional default value to use if the parameter is undefined
 *
 * @example
 * Basic usage:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 *
 * // Usage:
 * const api = container.getInstance(UserAPI);
 * api.getUser('123'); // GET https://api.example.com/users/123
 * ```
 *
 * @example
 * With default value:
 * ```typescript
 * @Get('/users/{id}/posts/{postId}')
 * getUserPost(
 *   @PathVariable('id') userId: string,
 *   @PathVariable('postId', 'latest') postId?: string
 * ) {
 *   return restful<Post>(userId, postId);
 * }
 * ```
 *
 * @returns A parameter decorator
 */
declare function PathVariable(name: string, defaultValue?: string | number | boolean): (target: object, methodName: string, parameterIndex: number) => void;

/**
 * Parameter decorator that binds a method parameter to a URL query parameter.
 *
 * Use this decorator to add query parameters to the request URL (e.g., `?page=1&limit=10`).
 * The decorated parameter value will be serialized and appended to the query string.
 * Supports both single values and arrays for multiple values with the same parameter name.
 *
 * @param name - The name of the query parameter
 * @param defaultValue - Optional default value to use if the parameter is undefined
 *
 * @example
 * Single query parameter:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users')
 *   getUsers(
 *     @Query('page') page: number,
 *     @Query('limit', 10) limit?: number
 *   ) {
 *     return restful<User[]>(page, limit);
 *   }
 * }
 *
 * // Usage:
 * api.getUsers(1, 20); // GET /users?page=1&limit=20
 * api.getUsers(2);     // GET /users?page=2&limit=10
 * ```
 *
 * @example
 * Array query parameter:
 * ```typescript
 * @Get('/users')
 * getUsers(@Query('ids') ids: string[]) {
 *   return restful<User[]>(ids);
 * }
 *
 * // Usage:
 * api.getUsers(['1', '2', '3']); // GET /users?ids=1&ids=2&ids=3
 * ```
 *
 * @returns A parameter decorator
 */
declare function Query(name: string, defaultValue?: string | number | boolean | Array<string | number | boolean>): (target: object, methodName: string, parameterIndex: number) => void;

/**
 * Parameter decorator that binds a method parameter to the HTTP request body.
 *
 * Use this decorator to specify which parameter should be sent as the request body payload.
 * The decorator automatically handles JSON serialization for plain objects and supports
 * standard body types like Blob, FormData, and ArrayBuffer.
 *
 * For plain objects, the decorator will:
 * - Automatically set `Content-Type: application/json` header
 * - JSON-stringify the object
 *
 * For BodyInit types (Blob, FormData, ArrayBuffer, etc.), the value is sent as-is.
 *
 * @example
 * Creating a resource with JSON payload:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Post('/users')
 *   createUser(@Payload() user: CreateUserDto) {
 *     return restful<User>(user);
 *   }
 * }
 *
 * // Usage:
 * api.createUser({ name: 'John', email: 'john@example.com' });
 * // POST /users
 * // Content-Type: application/json
 * // Body: {"name":"John","email":"john@example.com"}
 * ```
 *
 * @example
 * Uploading a file with FormData:
 * ```typescript
 * @Post('/users/{id}/avatar')
 * uploadAvatar(
 *   @PathVariable('id') id: string,
 *   @Payload() formData: FormData
 * ) {
 *   return upload<{ url: string }>(id, formData);
 * }
 *
 * // Usage:
 * const formData = new FormData();
 * formData.append('file', fileBlob);
 * api.uploadAvatar('123', formData);
 * ```
 *
 * @returns A parameter decorator
 */
declare function Payload(): (target: object, methodName: string, parameterIndex: number) => void;

interface RevalidateOptions {
    /**
     * Auto revalidate on window focus
     * @default true
     */
    focus: boolean;
    /**
     * Auto revalidate on network recovery
     * @default true
     */
    reconnect: boolean;
    /**
     * Auto revalidate when data becomes stale
     * @default true
     */
    ifStale?: boolean;
    /**
     * Custom events that trigger revalidation
     * @default []
     */
    events: string[];
}
interface SWRRetryContext {
    /**
     * The error that triggered the retry
     */
    error: unknown;
    /**
     * The current retry attempt number (starting from 1)
     */
    attempt: number;
    /**
     * Timestamp of when the error occurred
     */
    timestamp: number;
}
/**
 * Dynamically calculates the delay time (in milliseconds) for error retries.
 *
 * This function is used in error retry mechanisms to dynamically adjust the wait time for the next retry
 * based on the current retry attempt and the error type. By implementing strategies such as exponential backoff,
 * linear backoff, or custom logic, it helps prevent request storms, optimize resource utilization,
 * and improve user experience.
 *
 * @param attempt - The current retry attempt (starting from 1).
 * @param error - The error object that triggered the retry (optional).
 * @returns The delay time (in milliseconds) for the next retry. If `0` is returned, the retry will occur immediately.
 *
 * @example
 * // Default exponential backoff strategy
 * const defaultCalculateDelay = (attempt: number) => {
 *   const baseInterval = 1000; // Base interval
 *   const maxInterval = 30000; // Maximum interval
 *   const jitter = Math.random() * 100; // Add jitter to prevent thundering herd
 *   return Math.min(baseInterval * Math.pow(2, attempt - 1), maxInterval) + jitter;
 * };
 */
type CalculateDelay = (attempt: number, error?: unknown) => number;
interface SWRRetryConfig {
    /**
     * Maximum number of retry attempts
     * @default 3
     */
    maxAttempts: number;
    /**
     * Base interval between retries in milliseconds
     * @default 1000
     */
    interval: number;
    /**
     * Custom function to calculate delay between retries
     */
    calculateDelay?: CalculateDelay;
    /**
     * Custom function to determine if a retry should be attempted based on the error
     * @param ctx - Context containing error details and attempt count
     * @returns boolean indicating whether to retry
     */
    shouldRetryOnError?: (ctx: SWRRetryContext) => boolean;
}
interface SWRThrottleConfig {
    /**
     * Throttle interval in milliseconds
     */
    interval: number;
    /**
     * Whether to trigger on the leading edge of the timeout
     * @default true
     */
    leading?: boolean;
    /**
     * Whether to trigger on the trailing edge of the timeout
     * @default true
     */
    trailing?: boolean;
}
interface SWRRefreshConfig {
    /**
     * Polling interval in milliseconds. 0 to disable
     * @default 0
     */
    interval?: number;
    /**
     * Continue polling when window is invisible
     * @default false
     */
    whenHidden?: boolean;
    /**
     * Continue polling when offline
     * @default false
     */
    whenOffline?: boolean;
}
interface SWRConfig {
    /**
     * Revalidation configuration
     */
    revalidate: RevalidateOptions;
    /**
     * Event throttling configuration
     */
    throttle?: {
        /**
         * Custom event throttle configurations
         */
        [event: string]: SWRThrottleConfig;
    };
    /**
     * Error retry configuration
     */
    retry?: SWRRetryConfig;
    /**
     * Auto refresh configuration
     */
    refresh?: SWRRefreshConfig;
    /**
     * Data expiration time in milliseconds. 0 for no expiration
     * @default 0
     */
    staleTime?: number;
    /**
     * Deduplication interval in milliseconds
     * @default 2000
     */
    dedupingInterval?: number;
}

/**
 * Represents the current state of an SWR cache instance.
 *
 * @template T - The type of cached data
 */
interface SWRState<T> {
    /** The cached data, undefined if not yet fetched or if an error occurred */
    data?: T;
    /** The error that occurred during fetching, if any */
    error?: Error;
    /** Whether the initial fetch is in progress */
    isLoading: boolean;
    /** Whether a revalidation (background fetch) is in progress */
    isValidating: boolean;
    /** The reason for the current revalidation (e.g., 'focus', 'reconnect') */
    validatingReason?: string;
}
/**
 * Extended SWR state with mutation and revalidation methods.
 *
 * @template T - The type of cached data
 */
interface SWRResponse<T> extends SWRState<T> {
    /** Manually update the cached data and trigger revalidation */
    mutate: (data?: T) => void;
    /** Manually trigger revalidation with an optional reason */
    revalidate: (reason?: string) => Promise<void>;
}
/**
 * Options for creating an SWR instance.
 *
 * Extends {@link SWRConfig} with optional initial data.
 */
interface SWROptions extends Partial<SWRConfig> {
    /** Initial data to populate the cache before the first fetch */
    initialData?: unknown;
}
/**
 * Manages the lifecycle and state of a single SWR (Stale-While-Revalidate) cache entry.
 *
 * An SWR instance represents a single cached API request with its associated configuration.
 * It handles:
 * - Initial data fetching and loading state
 * - Automatic revalidation on focus, reconnect, or custom events
 * - Background revalidation while serving stale data
 * - Request deduplication to prevent redundant fetches
 * - Error retry with exponential backoff
 * - Automatic polling/refresh at intervals
 * - Manual cache mutation and revalidation
 *
 * Instances are typically created and managed automatically by the {@link SWR} decorator
 * through the {@link SWRService}, but can also be created manually for advanced use cases.
 *
 * @template T - The type of data managed by this SWR instance
 *
 * @example
 * Automatic usage via decorator (recommended):
 * ```typescript
 * @Get('/users/{id}')
 * @SWR({ revalidate: { focus: true } })
 * getUser(@PathVariable('id') id: string) {
 *   return restful<User>(id);
 * }
 *
 * // SWRInstance is created and managed automatically
 * const resource = api.getUser('123');
 * ```
 *
 * @example
 * Manual instance creation (advanced):
 * ```typescript
 * const swrInstance = new SWRInstance<User>(
 *   'user-123',
 *   async (key) => {
 *     const response = await fetch(`/api/users/${key.split('-')[1]}`);
 *     return response.json();
 *   },
 *   {
 *     revalidate: { focus: true, reconnect: true },
 *     staleTime: 60000
 *   }
 * );
 *
 * // Listen to state changes
 * swrInstance.onStateChange((state) => {
 *   console.log('Data:', state.data);
 *   console.log('Loading:', state.isLoading);
 * });
 * ```
 */
declare class SWRInstance<T> {
    readonly key: string;
    private readonly fetcher;
    readonly options: SWROptions;
    private readonly config;
    private state;
    private lastFetchTime;
    private currentRetryAttempt;
    private refreshInterval?;
    private readonly cleanupFns;
    private readonly abortController;
    private get signal();
    private events;
    constructor(key: string, fetcher: (key: string) => Promise<T>, options?: SWROptions);
    onStateChange(listener: (state: SWRState<T>) => void): () => void;
    private setState;
    private revalidate;
    private initRevalidationStrategy;
    private setupRefreshInterval;
    mutate(data?: T): void;
    getState(): SWRResponse<T>;
    destroy(): void;
}

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
/**
 * Configuration options for the {@link SWR} decorator.
 *
 * Extends {@link SWRConfig} with an optional custom cache key generator.
 */
interface SWRDecoratorConfig extends DeepPartial<SWRConfig> {
    /**
     * Custom cache key for the SWR instance.
     *
     * Can be either:
     * - A static string key
     * - A function that generates a key based on method arguments
     *
     * If not provided, the resolved URL will be used as the cache key.
     */
    key?: string | ((...args: any[]) => string);
}
/**
 * Decorator that enables SWR (Stale-While-Revalidate) pattern for an endpoint method.
 *
 * The SWR pattern provides:
 * - **Automatic caching**: Responses are cached and reused for subsequent requests
 * - **Background revalidation**: Cached data is served immediately while fresh data is fetched in the background
 * - **Focus revalidation**: Automatically refetches when the window regains focus
 * - **Network recovery**: Automatically refetches when network connection is restored
 * - **Polling**: Optional automatic refresh at specified intervals
 * - **Deduplication**: Multiple requests with the same key are deduplicated
 *
 * This significantly improves user experience by showing cached data instantly while ensuring
 * data freshness through background updates.
 *
 * @param config - SWR configuration options
 * @param config.key - Optional custom cache key (string or function)
 * @param config.revalidate - Revalidation triggers configuration
 * @param config.revalidate.focus - Auto revalidate on window focus (default: true)
 * @param config.revalidate.reconnect - Auto revalidate on network recovery (default: true)
 * @param config.revalidate.events - Custom events that trigger revalidation
 * @param config.refresh - Automatic refresh configuration
 * @param config.refresh.interval - Polling interval in milliseconds (0 to disable)
 * @param config.refresh.whenHidden - Continue polling when window is invisible
 * @param config.refresh.whenOffline - Continue polling when offline
 * @param config.retry - Error retry configuration
 * @param config.staleTime - Time in milliseconds before data becomes stale
 * @param config.dedupingInterval - Deduplication interval in milliseconds
 *
 * @example
 * Basic usage with default config:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   @SWR()
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 *
 * // First call: fetches from server
 * const resource1 = api.getUser('123');
 *
 * // Second call: returns cached data immediately, revalidates in background
 * const resource2 = api.getUser('123');
 * ```
 *
 * @example
 * With custom revalidation settings:
 * ```typescript
 * @Get('/notifications')
 * @SWR({
 *   revalidate: {
 *     focus: true,        // Revalidate on window focus
 *     reconnect: true,    // Revalidate on network recovery
 *     events: ['user-action'] // Revalidate on custom events
 *   }
 * })
 * getNotifications() {
 *   return restful<Notification[]>();
 * }
 * ```
 *
 * @example
 * With polling:
 * ```typescript
 * @Get('/status')
 * @SWR({
 *   refresh: {
 *     interval: 5000,      // Poll every 5 seconds
 *     whenHidden: false,   // Pause when tab is hidden
 *     whenOffline: false   // Pause when offline
 *   }
 * })
 * getSystemStatus() {
 *   return restful<SystemStatus>();
 * }
 * ```
 *
 * @example
 * With custom cache key:
 * ```typescript
 * @Get('/users/{id}')
 * @SWR({
 *   key: (id: string) => `user-profile-${id}`,
 *   staleTime: 60000  // Consider data stale after 1 minute
 * })
 * getUser(@PathVariable('id') id: string) {
 *   return restful<User>(id);
 * }
 * ```
 *
 * @returns A method decorator
 *
 * @see {@link SWRConfig} for detailed configuration options
 * @see {@link SWRMutation} for invalidating SWR cache after mutations
 */
declare function SWR(config?: SWRDecoratorConfig): <R = any, A extends Array<any> = any[], T extends (...args: any[]) => any = (...args: A) => R>(target: unknown, context: ClassMethodDecoratorContext<object, T> | string | symbol, descriptor?: TypedPropertyDescriptor<T>) => void | TypedPropertyDescriptor<(...args: any[]) => any>;

/**
 * Decorator that marks a mutation method and automatically invalidates related SWR cache.
 *
 * Use this decorator on mutation methods (POST, PUT, DELETE) that modify server data.
 * After the mutation completes successfully, it automatically triggers revalidation
 * of the specified SWR cache key, ensuring that all components using that cached data
 * receive fresh updates.
 *
 * This is essential for maintaining data consistency between read and write operations
 * in applications using the SWR pattern.
 *
 * @param _keygen - Cache key identifier for the SWR instance to invalidate
 *                  - Can be a static string matching an {@link SWR} decorator's key
 *                  - Can be a function that generates the key based on method arguments
 *
 * @example
 * Basic usage with static key:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   // Read operation with SWR caching
 *   @Get('/users/{id}')
 *   @SWR({ key: 'user-profile' })
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 *
 *   // Write operation that invalidates the cache
 *   @Put('/users/{id}')
 *   @SWRMutation('user-profile')
 *   updateUser(
 *     @PathVariable('id') id: string,
 *     @Payload() data: UpdateUserDto
 *   ) {
 *     return restful<User>(id, data);
 *   }
 * }
 *
 * // Usage:
 * // 1. Initial fetch - data is cached
 * const userResource = api.getUser('123');
 *
 * // 2. Update user - cache is automatically invalidated and refetched
 * await api.updateUser('123', { name: 'Jane' }).wait();
 *
 * // 3. userResource automatically receives updated data
 * ```
 *
 * @example
 * With dynamic key generator:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class PostAPI {
 *   @Get('/users/{userId}/posts')
 *   @SWR({ key: (userId: string) => `user-${userId}-posts` })
 *   getUserPosts(@PathVariable('userId') userId: string) {
 *     return restful<Post[]>(userId);
 *   }
 *
 *   @Post('/users/{userId}/posts')
 *   @SWRMutation((userId: string) => `user-${userId}-posts`)
 *   createPost(
 *     @PathVariable('userId') userId: string,
 *     @Payload() post: CreatePostDto
 *   ) {
 *     return restful<Post>(userId, post);
 *   }
 *
 *   @Delete('/posts/{postId}')
 *   @SWRMutation((postId: string, userId: string) => `user-${userId}-posts`)
 *   deletePost(
 *     @PathVariable('postId') postId: string,
 *     @Query('userId') userId: string
 *   ) {
 *     return restful(postId, userId);
 *   }
 * }
 *
 * // When a post is created or deleted, the post list is automatically refreshed
 * ```
 *
 * @example
 * Multiple related caches:
 * ```typescript
 * // If you need to invalidate multiple caches, you can compose multiple decorators
 * // or handle it manually in the method
 * @Post('/comments')
 * @SWRMutation('comments-list')
 * createComment(@Payload() comment: CreateCommentDto) {
 *   return restful<Comment>(comment);
 * }
 * ```
 *
 * @returns A method decorator that adds cache invalidation behavior
 *
 * @see {@link SWR} for the corresponding read operation decorator
 */
declare function SWRMutation(_keygen: string | ((...args: any[]) => string)): <R = any, A extends Array<any> = any[], T extends (...args: any[]) => any = (...args: A) => R>(target: unknown, context: ClassMethodDecoratorContext<object, T> | string | symbol, descriptor?: TypedPropertyDescriptor<T>) => void | TypedPropertyDescriptor<(...args: any[]) => any>;

declare function Key(key: string | ((...args: any[]) => string)): (target: object, propertyKey: ClassMethodDecoratorContext | string | symbol) => void;

interface ExecutionContext {
    instance: EndpointInstance;
    method: RequestMethod;
    params: ExecuteRequestMethodParams;
}

/**
 * Represents an error that occurred during resource processing
 */
declare class ResourceError<B = unknown> {
    static wrap(error: unknown): ResourceError<any>;
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
    constructor(error: unknown);
    /**
     * Check if this is a client error (4xx)
     */
    get isClientError(): boolean;
    /**
     * Check if this is a server error (5xx)
     */
    get isServerError(): boolean;
    /**
     * Check if this is a network error
     */
    get isNetworkError(): boolean;
    /**
     * Check if this is a timeout error
     */
    get isTimeoutError(): boolean;
    /**
     * Check if this is an abort error
     */
    get isAbortError(): boolean;
    /**
     * Check if this is a parse error
     */
    get isParseError(): boolean;
    /**
     * Convert to string
     */
    toString(): string;
}

declare enum RequestStatus {
    IDLE = 0,
    OPENED = 1,
    LOADING = 2,
    SUCCESS = 3,
    ERROR = 4,
    ABORTED = 5
}

declare class ResourceExecutionState<T, E = unknown> extends ReplaySubject<T> {
    messages: T[];
    data?: T;
    reason: ResourceError<E> | null;
    status: RequestStatus;
    headers: HttpHeaders;
    httpStatus: number;
    abortController: AbortController;
    constructor();
    protected init(): void;
    headerReceived(headers: HttpHeaders, httpStatus: number): void;
    get idle(): boolean;
    get opened(): boolean;
    get loading(): boolean;
    get success(): boolean;
    get aborted(): boolean;
    get failure(): boolean;
    reset(): void;
}

/**
 * @internal Symbol for executing the resource
 */
declare const EXECUTE: unique symbol;
/**
 * @internal Symbol for setting data
 */
declare const SET_DATA: unique symbol;
/**
 * @internal Symbol for setting error
 */
declare const SET_ERROR: unique symbol;
/**
 * @internal Symbol for setup
 */
declare const SETUP: unique symbol;
/**
 * Type alias for a Resource with any data type.
 * @internal
 */
type AnyResource = Resource<any, unknown>;
/**
 * Abstract base class for all HTTP request resources.
 *
 * A Resource represents an HTTP request with reactive state management, providing:
 * - **Reactive state**: All state properties (data, loading, error, etc.) are reactive signals
 * - **Observable pattern**: Subscribe to state changes via RxJS Observables
 * - **Promise interface**: Wait for completion with `wait()` method
 * - **Lifecycle management**: Automatic abort controller and cleanup
 * - **Type safety**: Strong TypeScript typing for request/response data
 *
 * The Resource class is the foundation of the library's reactive HTTP layer, integrating
 * seamlessly with Solid.js components through signal-based reactivity.
 *
 * Resource lifecycle states (exposed as reactive properties):
 * - `idle`: Initial state before request starts
 * - `loading`: Request is in progress
 * - `opened`: Connection established (for streaming)
 * - `success`: Request completed successfully
 * - `failure`: Request failed with an error
 * - `aborted`: Request was aborted
 *
 * Specialized resource types:
 * - {@link RestfulResource}: Standard REST API calls with optional SWR
 * - {@link DownloadResource}: File downloads with progress tracking
 * - {@link UploadResource}: File uploads with progress tracking
 * - {@link JSONSSEResource}: Server-Sent Events with JSON parsing
 * - {@link TextSSEResource}: Server-Sent Events with text streaming
 *
 * @template T - The type of data returned by the request
 * @template B - The type of error body (defaults to unknown)
 *
 * @example
 * Using a resource in a Solid component:
 * ```typescript
 * function UserProfile(props: { userId: string }) {
 *   const api = useService(UserAPI);
 *   const userResource = api.getUser(props.userId);
 *
 *   return (
 *     <Show
 *       when={!userResource.loading}
 *       fallback={<div>Loading...</div>}
 *     >
 *       <Show
 *         when={userResource.success}
 *         fallback={<div>Error: {userResource.error?.message}</div>}
 *       >
 *         <div>Name: {userResource.data?.name}</div>
 *       </Show>
 *     </Show>
 *   );
 * }
 * ```
 *
 * @example
 * Subscribing to state changes:
 * ```typescript
 * const resource = api.getData();
 *
 * resource.subscribe((state) => {
 *   console.log('State changed:', {
 *     loading: state.loading,
 *     data: state.data,
 *     error: state.reason
 *   });
 * });
 * ```
 *
 * @example
 * Waiting for completion:
 * ```typescript
 * const resource = api.createUser(userData);
 *
 * try {
 *   const state = await resource.wait();
 *   if (state.success) {
 *     console.log('User created:', state.data);
 *   }
 * } catch (error) {
 *   console.error('Failed to create user:', error);
 * }
 * ```
 *
 * @example
 * Manual reload:
 * ```typescript
 * const resource = api.getData();
 *
 * // Later, reload the data
 * resource.reload(true); // force=true bypasses cache
 * ```
 */
declare abstract class Resource<T, B = unknown> {
    private readonly $state;
    protected state?: ResourceExecutionState<T, B>;
    protected ioc: ApplicationContext;
    get data(): T | undefined;
    get error(): ResourceError<B> | undefined | null;
    get messages(): T[];
    get idle(): boolean;
    get opened(): boolean;
    get loading(): boolean;
    get success(): boolean;
    get aborted(): boolean;
    get failure(): boolean;
    protected readonly abortController: AbortController;
    protected context?: ExecutionContext;
    protected init(): void;
    [SETUP](context: ExecutionContext): void;
    wait(): Promise<T>;
    subscribe(observerOrNext?: Partial<Observer<ResourceExecutionState<T, B>>> | ((value: ResourceExecutionState<T, B>) => void)): rxjs.Subscription;
    reload(force?: boolean): Promise<void>;
    protected [EXECUTE](force?: boolean, state?: ResourceExecutionState<T, B>): void;
    protected resolveResponseBody(response: HttpResponse): AsyncGenerator<unknown, void, unknown>;
    protected handleResponse(response: HttpResponse, state: ResourceExecutionState<T, B>): Promise<void>;
    protected handleHttpErrorResponse(response: HttpResponse): Promise<void>;
}

/**
 * Resource implementation for standard RESTful HTTP requests.
 *
 * This is the primary resource type used by the {@link restful} execution function
 * for standard REST API calls (GET, POST, PUT, DELETE, etc.). It extends the base
 * {@link Resource} class with:
 * - SWR (Stale-While-Revalidate) integration
 * - Automatic cache management
 * - Background revalidation
 * - Cache mutation support
 *
 * When decorated with {@link SWR}, RestfulResource automatically:
 * - Caches responses based on a unique key
 * - Serves cached data immediately while revalidating in the background
 * - Revalidates on focus, reconnect, or custom events
 * - Deduplicates concurrent requests with the same key
 * - Provides automatic polling/refresh capabilities
 *
 * The resource integrates with the {@link SWRService} to manage cache instances
 * and coordinate updates across multiple components using the same data.
 *
 * @template T - The type of response data
 * @template E - The type of error body (defaults to unknown)
 *
 * @example
 * Basic RESTful request (no SWR):
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 *
 * // Usage
 * const resource = api.getUser('123');
 * // Fetches fresh data every time
 * ```
 *
 * @example
 * With SWR caching and revalidation:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   @SWR({
 *     key: (id) => `user-${id}`,
 *     revalidate: { focus: true, reconnect: true },
 *     staleTime: 60000  // Consider stale after 1 minute
 *   })
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 *
 * // First call: fetches from server
 * const resource1 = api.getUser('123');
 *
 * // Second call: returns cached data, revalidates in background
 * const resource2 = api.getUser('123');
 * ```
 *
 * @example
 * Mutation with automatic cache invalidation:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   @SWR({ key: (id) => `user-${id}` })
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 *
 *   @Put('/users/{id}')
 *   @SWRMutation((id: string) => `user-${id}`)
 *   updateUser(
 *     @PathVariable('id') id: string,
 *     @Payload() data: UpdateUserDto
 *   ) {
 *     return restful<User>(id, data);
 *   }
 * }
 *
 * // When updateUser completes, the getUser cache is automatically invalidated
 * ```
 *
 * @see {@link Resource} for the base class documentation
 * @see {@link SWR} for caching configuration
 * @see {@link SWRMutation} for cache invalidation
 * @see {@link restful} for the execution function
 */
declare class RestfulResource<T, E = unknown> extends Resource<T, E> {
    private swrService;
    protected [EXECUTE](force?: boolean): void;
}

/**
 * Executes a RESTful HTTP request and returns a reactive resource.
 *
 * This is the primary execution function for standard REST API calls (GET, POST, PUT, DELETE).
 * It returns a {@link RestfulResource} that provides reactive state management and integrates
 * with SWR (stale-while-revalidate) pattern when configured.
 *
 * The returned resource exposes:
 * - `data`: The response data (reactive)
 * - `error`: Any error that occurred (reactive)
 * - `loading`: Loading state indicator (reactive)
 * - `success`: Success state indicator (reactive)
 * - `failure`: Failure state indicator (reactive)
 * - `reload()`: Method to manually reload the request
 * - `wait()`: Promise that resolves when the request completes
 *
 * @template T - The expected response data type
 * @template A - The arguments tuple type (automatically inferred)
 * @param args - Arguments to pass through to the execution context (typically unused in the function body)
 *
 * @returns A reactive {@link RestfulResource} containing request state and data
 *
 * @example
 * Basic usage with GET request:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 *
 * // In component:
 * const api = useService(UserAPI);
 * const resource = api.getUser('123');
 *
 * // Access reactive state:
 * createEffect(() => {
 *   if (resource.loading) console.log('Loading...');
 *   if (resource.success) console.log('User:', resource.data);
 *   if (resource.failure) console.log('Error:', resource.error);
 * });
 * ```
 *
 * @example
 * With POST request:
 * ```typescript
 * @Post('/users')
 * createUser(@Payload() user: CreateUserDto) {
 *   return restful<User>(user);
 * }
 *
 * // Usage:
 * const resource = api.createUser({ name: 'John', email: 'john@example.com' });
 * await resource.wait(); // Wait for completion
 * ```
 *
 * @example
 * With SWR pattern:
 * ```typescript
 * @Get('/users/{id}')
 * @SWR({ revalidate: { focus: true } })
 * getUser(@PathVariable('id') id: string) {
 *   return restful<User>(id);
 * }
 * // Automatically revalidates when window regains focus
 * ```
 */
declare function restful<T, A extends unknown[] = unknown[]>(...args: A): RestfulResource<T, unknown>;

declare class JSONSSEResource<T> extends Resource<T> {
    protected resolveResponseBody(response: HttpResponse): AsyncGenerator<unknown, void, unknown>;
}

/**
 * Executes a Server-Sent Events (SSE) request that streams JSON objects.
 *
 * Use this function for real-time streaming endpoints that send JSON data over SSE.
 * Each server-sent event will be automatically parsed as JSON and made available through
 * the {@link JSONSSEResource}. The resource accumulates all received messages in the
 * `messages` array while also providing the latest message in `data`.
 *
 * This function automatically uses the {@link FetchRequestAdapter} which is required
 * for streaming responses.
 *
 * The returned resource exposes:
 * - `data`: The most recent JSON message received
 * - `messages`: Array of all JSON messages received so far
 * - `loading`, `success`, `failure`: State indicators
 * - `opened`: Indicates if the SSE connection is established
 *
 * @template T - The type of JSON objects in the SSE stream
 * @param args - Arguments to pass through to the execution context
 *
 * @returns A {@link JSONSSEResource} for handling the SSE stream
 *
 * @throws {Error} If called outside of an endpoint method context
 *
 * @example
 * Live updates stream:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class EventAPI {
 *   @Get('/events/stream')
 *   streamEvents(@Query('topic') topic: string) {
 *     return jsonsse<EventData>(topic);
 *   }
 * }
 *
 * interface EventData {
 *   id: string;
 *   type: string;
 *   payload: unknown;
 * }
 *
 * // Usage:
 * const resource = api.streamEvents('notifications');
 *
 * // Access latest message:
 * createEffect(() => {
 *   const latestEvent = resource.data;
 *   if (latestEvent) {
 *     console.log('New event:', latestEvent);
 *   }
 * });
 *
 * // Access all messages:
 * createEffect(() => {
 *   console.log('All events:', resource.messages);
 * });
 * ```
 *
 * @example
 * Real-time chat:
 * ```typescript
 * @Get('/chat/{roomId}/messages')
 * streamMessages(@PathVariable('roomId') roomId: string) {
 *   return jsonsse<ChatMessage>(roomId);
 * }
 *
 * interface ChatMessage {
 *   id: string;
 *   author: string;
 *   text: string;
 *   timestamp: number;
 * }
 *
 * // Usage:
 * const resource = api.streamMessages('room-123');
 *
 * // Render all messages:
 * <For each={resource.messages}>
 *   {(message) => <div>{message.author}: {message.text}</div>}
 * </For>
 * ```
 *
 * @see {@link JSONSSEResource} for more details on the resource type
 */
declare function jsonsse<T>(...args: unknown[]): JSONSSEResource<T>;

declare abstract class ProgressiveResource<T, E = unknown> extends Resource<T, E> {
    progress: Progress;
    protected updateProgress(progress: Progress): void;
}

declare class DownloadResource extends ProgressiveResource<ByteStream> {
    progress: Progress;
    protected handleResponse(response: HttpResponse, state: ResourceExecutionState<ByteStream, unknown>): Promise<void>;
    protected updateProgress(progress: Progress): void;
    protected resolveResponseBody(response: HttpResponse): AsyncGenerator<ByteStream, void, unknown>;
}

/**
 * Executes a file download request with progress tracking.
 *
 * Use this function for downloading files from the server. It returns a {@link DownloadResource}
 * that provides download progress tracking in addition to standard resource state management.
 *
 * The returned resource exposes:
 * - `data`: The downloaded file as a {@link ByteStream}
 * - `progress`: Download progress information (bytes downloaded, total size, percentage)
 * - `loading`, `success`, `failure`: State indicators
 * - Standard resource methods and properties
 *
 * @param args - Arguments to pass through to the execution context
 *
 * @returns A {@link DownloadResource} with progress tracking capabilities
 *
 * @example
 * Downloading a file:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class FileAPI {
 *   @Get('/files/{id}/download')
 *   downloadFile(@PathVariable('id') fileId: string) {
 *     return download(fileId);
 *   }
 * }
 *
 * // Usage:
 * const resource = api.downloadFile('abc123');
 *
 * // Track progress:
 * createEffect(() => {
 *   const progress = resource.progress;
 *   if (progress) {
 *     console.log(`Downloaded: ${progress.percentage}%`);
 *   }
 * });
 *
 * // Get the file when complete:
 * resource.wait().then(state => {
 *   const blob = state.data?.readAsBlob();
 *   // Create download link, etc.
 * });
 * ```
 *
 * @example
 * Save downloaded file:
 * ```typescript
 * const resource = api.downloadFile('report.pdf');
 * await resource.wait();
 *
 * const blob = await resource.data?.readAsBlob();
 * const url = URL.createObjectURL(blob);
 * const link = document.createElement('a');
 * link.href = url;
 * link.download = 'report.pdf';
 * link.click();
 * ```
 */
declare function download(...args: unknown[]): DownloadResource;

declare class UploadResource<T extends BodyInit, B = unknown> extends ProgressiveResource<T, B> {
    progress: Progress;
    protected updateProgress(progress: Progress): void;
    protected handleResponse(response: HttpResponse, state: ResourceExecutionState<T, B>): Promise<void>;
}

/**
 * Executes a file upload request with progress tracking.
 *
 * Use this function for uploading files to the server. It returns an {@link UploadResource}
 * that provides upload progress tracking in addition to standard resource state management.
 *
 * The returned resource exposes:
 * - `data`: The response from the server after upload completes
 * - `progress`: Upload progress information (bytes uploaded, total size, percentage)
 * - `loading`, `success`, `failure`: State indicators
 * - Standard resource methods and properties
 *
 * @param args - Arguments to pass through to the execution context
 *
 * @returns An {@link UploadResource} with progress tracking capabilities
 *
 * @example
 * Uploading a file with FormData:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class FileAPI {
 *   @Post('/files/upload')
 *   uploadFile(@Payload() formData: FormData) {
 *     return upload<{ fileId: string; url: string }>(formData);
 *   }
 * }
 *
 * // Usage:
 * const formData = new FormData();
 * formData.append('file', fileBlob, 'document.pdf');
 * formData.append('category', 'reports');
 *
 * const resource = api.uploadFile(formData);
 *
 * // Track upload progress:
 * createEffect(() => {
 *   const progress = resource.progress;
 *   if (progress) {
 *     console.log(`Uploaded: ${progress.percentage}%`);
 *     console.log(`${progress.loaded} / ${progress.total} bytes`);
 *   }
 * });
 *
 * // Handle completion:
 * resource.wait().then(state => {
 *   if (state.success) {
 *     console.log('File uploaded:', state.data);
 *   }
 * });
 * ```
 *
 * @example
 * With avatar upload:
 * ```typescript
 * @Post('/users/{id}/avatar')
 * uploadAvatar(
 *   @PathVariable('id') userId: string,
 *   @Payload() formData: FormData
 * ) {
 *   return upload<{ avatarUrl: string }>(userId, formData);
 * }
 *
 * // Usage:
 * const formData = new FormData();
 * formData.append('avatar', avatarBlob);
 * const resource = api.uploadAvatar('user123', formData);
 * ```
 */
declare function upload(...args: unknown[]): UploadResource<BodyInit, unknown>;

/**
 * Type for parameters that support reactive values in endpoint methods.
 *
 * This type allows endpoint method parameters to accept three forms:
 * 1. **Direct value**: A static value of type `T`
 * 2. **Undefined**: Explicitly undefined for optional parameters
 * 3. **Accessor function**: A function returning `T | undefined` (Solid.js signal/memo)
 *
 * This enables seamless integration with Solid.js's reactivity system, where parameters
 * can be either static values or reactive signals that automatically trigger re-execution
 * when their values change.
 *
 * @template T - The underlying value type
 *
 * @example
 * Using static values:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   getUser(@PathVariable('id') userId: R<string>) {
 *     return restful<User>(userId);
 *   }
 * }
 *
 * // Static value
 * const resource = api.getUser('123');
 * ```
 *
 * @example
 * Using reactive signals (Solid.js):
 * ```typescript
 * function UserProfile() {
 *   const [userId, setUserId] = createSignal('123');
 *   const api = useService(UserAPI);
 *
 *   // Pass signal accessor - automatically refetches when userId changes
 *   const userResource = api.getUser(userId);
 *
 *   return (
 *     <div>
 *       <input
 *         value={userId()}
 *         onInput={(e) => setUserId(e.target.value)}
 *       />
 *       <div>Name: {userResource.data?.name}</div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * Multiple reactive parameters:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class PostAPI {
 *   @Get('/posts')
 *   getPosts(
 *     @Query('page') page: R<number>,
 *     @Query('limit') limit: R<number>,
 *     @Query('search') search: R<string>
 *   ) {
 *     return restful<Post[]>(page, limit, search);
 *   }
 * }
 *
 * // In component
 * function PostList() {
 *   const [page, setPage] = createSignal(1);
 *   const [search, setSearch] = createSignal('');
 *   const api = useService(PostAPI);
 *
 *   // Automatically refetches when page or search changes
 *   const posts = api.getPosts(page, () => 20, search);
 *
 *   return <div>...</div>;
 * }
 * ```
 *
 * @example
 * With optional parameters:
 * ```typescript
 * @Get('/users/{id}')
 * getUser(
 *   @PathVariable('id') userId: R<string>,
 *   @Header('Authorization') token?: R<string>
 * ) {
 *   return restful<User>(userId, token);
 * }
 *
 * // Can pass undefined for optional parameters
 * const resource = api.getUser('123', undefined);
 * ```
 */
type Reactive<T> = T | undefined | (() => T | undefined);
/**
 * Shorthand alias for {@link Reactive} type.
 *
 * Use this concise form in parameter declarations for better readability.
 * It has exactly the same behavior as `Reactive<T>`.
 *
 * @template T - The underlying value type
 *
 * @example
 * ```typescript
 * // These are equivalent:
 * getUser(@PathVariable('id') id: Reactive<string>)
 * getUser(@PathVariable('id') id: R<string>)
 * ```
 *
 * @see {@link Reactive} for detailed documentation and examples
 */
type R<T> = Reactive<T>;

interface CacheEntry {
    /** The cached response data */
    response: {
        status: number;
        headers: Record<string, string[]>;
        body: Uint8Array;
    };
    /** When the entry was cached */
    cachedAt: number;
    /** When the entry expires (based on Cache-Control or config) */
    expiresAt: number;
    /** Metadata about the entry */
    metadata: Record<string, any>;
}

/**
 * Defines a caching policy for HTTP responses.
 *
 * A cache policy controls how and when HTTP responses are cached. It determines:
 * - Whether a request should be cached
 * - How long cached data remains valid (TTL)
 * - When cached data should be invalidated
 * - Optional modifications to cache entries
 *
 * You can implement custom policies for advanced caching strategies such as:
 * - Time-based expiration (TTL)
 * - Conditional caching based on request/response headers
 * - Cache warming and pre-fetching
 * - Adaptive caching based on usage patterns
 * - ETag-based validation
 *
 * @example
 * Simple time-based policy:
 * ```typescript
 * const myPolicy: CachePolicy = {
 *   name: 'MyPolicy',
 *   shouldCache: () => true,
 *   getTTL: () => 60000, // 1 minute
 *   isValid: (entry) => entry.expiresAt > Date.now()
 * };
 * ```
 *
 * @example
 * Conditional policy based on request:
 * ```typescript
 * const conditionalPolicy: CachePolicy = {
 *   name: 'ConditionalPolicy',
 *   shouldCache: (method, params) => {
 *     // Only cache if not explicitly forcing refresh
 *     return !params.force;
 *   },
 *   getTTL: (method, params) => {
 *     // Different TTL based on endpoint
 *     if (method.url.includes('/static/')) return 24 * 60 * 60 * 1000; // 1 day
 *     return 5 * 60 * 1000; // 5 minutes
 *   },
 *   isValid: (entry) => entry.expiresAt > Date.now()
 * };
 * ```
 *
 * @example
 * Policy with cache entry metadata:
 * ```typescript
 * const taggedPolicy: CachePolicy = {
 *   name: 'TaggedPolicy',
 *   shouldCache: () => true,
 *   getTTL: () => 300000,
 *   isValid: (entry) => entry.expiresAt > Date.now(),
 *   overrideCacheEntry: (entry, method, params) => ({
 *     ...entry,
 *     metadata: {
 *       ...entry.metadata,
 *       tags: ['user-data'],
 *       userId: params.pathVariables['id']
 *     }
 *   })
 * };
 * ```
 */
interface CachePolicy {
    /** Human-readable name for the policy (used for debugging and logging) */
    readonly name: string;
    /**
     * Determines if a request should be cached.
     *
     * This method is called before making the request to decide if the
     * response should be cached. Return `false` to bypass caching entirely.
     *
     * @param method - The request method being invoked
     * @param params - The request parameters
     * @returns `true` if the response should be cached, `false` otherwise
     */
    shouldCache(method: RequestMethod, params: ExecuteRequestMethodParams): boolean;
    /**
     * Optionally modifies or enriches a cache entry before it's stored.
     *
     * Use this to add custom metadata, tags, or other information to the
     * cache entry. This is useful for cache invalidation strategies,
     * cache statistics, or debugging.
     *
     * @param cacheEntry - The cache entry about to be stored
     * @param method - The request method
     * @param params - The request parameters
     * @returns The modified cache entry
     */
    overrideCacheEntry?(cacheEntry: CacheEntry, method: RequestMethod, params: ExecuteRequestMethodParams): CacheEntry;
    /**
     * Determines the TTL (time-to-live) for a cache entry in milliseconds.
     *
     * This value is used to calculate the expiration time for the cached data.
     * Return `0` to indicate that the response should not be cached.
     *
     * @param method - The request method
     * @param params - The request parameters
     * @returns The TTL in milliseconds, or `0` to not cache
     */
    getTTL(method: RequestMethod, params: ExecuteRequestMethodParams): number;
    /**
     * Determines if a cached entry is still valid.
     *
     * This method is called when retrieving data from the cache to verify
     * it's still usable. Return `false` to invalidate the cache entry and
     * trigger a new request.
     *
     * Common validation strategies:
     * - Check if current time is before expiration time
     * - Verify ETags or version numbers
     * - Check if data structure is still compatible
     *
     * @param entry - The cached entry to validate
     * @param method - The request method
     * @param params - The request parameters
     * @returns `true` if the entry is valid, `false` to invalidate and refetch
     */
    isValid(entry: CacheEntry, method: RequestMethod, params: ExecuteRequestMethodParams): boolean;
}

interface CacheConfig {
    /**
     * The cache policy to use
     * @default CachePolicies.Default
     */
    policy?: CachePolicy;
    /**
     * Whether to respect Cache-Control headers from the response
     * @default true
     */
    respectCacheControl?: boolean;
    /**
     * Custom function to determine if a request should be cached
     */
    shouldCache?: (method: RequestMethod, params: ExecuteRequestMethodParams) => boolean;
    /**
     * Custom function to generate a cache key
     */
    generateKey?: (method: RequestMethod, params: ExecuteRequestMethodParams) => string;
    /**
     * Name of the bucket to use for caching
     */
    bucketName?: string;
}

/**
 * Decorator that applies the CacheInterceptor to an endpoint method.
 *
 * @example
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com'
 * })
 * class ExampleAPI {
 *   @Get('/users/{id}')
 *   @Cache({
 *     policy: CachePolicies.createTimeBasedPolicy(60 * 1000) // 1 minute cache
 *   })
 *   getUser(id: number) {
 *     return restful<User>();
 *   }
 * }
 * ```
 */
declare function Cache(config?: CacheConfig): <R = any, A extends Array<any> = any[], T extends (...args: any[]) => any = (...args: A) => R>(target: unknown, context: ClassMethodDecoratorContext<object, T> | string | symbol, descriptor?: TypedPropertyDescriptor<T>) => void | TypedPropertyDescriptor<(...args: any[]) => any>;

/**
 * An interceptor that caches HTTP responses and serves them from cache when appropriate.
 *
 * By default, it only caches GET requests and respects Cache-Control headers.
 *
 * @example
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com'
 * })
 * class ExampleAPI {
 *   @Get('/user/:id')
 *   @Cache({
 *     Policies.createTimeBasedPolicy(60 * 1000)
 *   })
 *   getUser(id: string) {
 *     return restful(id);
 *   }
 * }
 * ```
 */
declare class CacheInterceptor implements Interceptor {
    static createWithConfig(config?: CacheConfig): InterceptorConstructor;
    private readonly config;
    private get policy();
    private bucket?;
    private appCtx;
    private httpConfig?;
    protected constructor(config?: CacheConfig);
    private getBucket;
    private generateCacheKey;
    private shouldCache;
    private getExpirationFromHeaders;
    invoke(instance: EndpointInstance, method: RequestMethod, params: ExecuteRequestMethodParams, next: InterceptorNextFunction): Promise<HttpResponse>;
}

/**
 * Creates a time-based caching policy with a fixed TTL (Time-To-Live).
 *
 * This factory function creates a simple caching policy where cached entries
 * expire after a fixed duration. It's the most common caching strategy for
 * data that changes predictably over time.
 *
 * @param ttl - The time-to-live in milliseconds (how long cached data remains valid)
 * @param name - Optional name for the policy (defaults to 'TimeBasedPolicy(${ttl}ms)')
 * @returns A new {@link CachePolicy} instance
 *
 * @example
 * ```typescript
 * const fiveMinutePolicy = CachePolicies.createTimeBasedPolicy(5 * 60 * 1000);
 * const oneHourPolicy = CachePolicies.createTimeBasedPolicy(60 * 60 * 1000);
 *
 * @Get('/data')
 * @Cache({ policy: fiveMinutePolicy })
 * getData() {
 *   return restful<Data>();
 * }
 * ```
 */
declare function createTimeBasedPolicy(ttl: number, name?: string): CachePolicy;
/**
 * Collection of predefined caching policies for common use cases.
 *
 * This object provides convenient, ready-to-use caching policies that cover
 * the most common caching scenarios. You can use these directly or create
 * custom policies using {@link createTimeBasedPolicy} or by implementing
 * the {@link CachePolicy} interface.
 *
 * @example
 * Using predefined policies:
 * ```typescript
 * // No caching
 * @Get('/live-data')
 * @Cache({ policy: CachePolicies.NoCache })
 * getLiveData() {
 *   return restful<Data>();
 * }
 *
 * // Default 5-minute cache
 * @Get('/user-profile')
 * @Cache({ policy: CachePolicies.Default })
 * getUserProfile() {
 *   return restful<User>();
 * }
 * ```
 *
 * @example
 * Creating custom time-based policies:
 * ```typescript
 * const oneHourCache = CachePolicies.createTimeBasedPolicy(60 * 60 * 1000);
 * const oneDay Cache = CachePolicies.createTimeBasedPolicy(24 * 60 * 60 * 1000);
 *
 * @Get('/daily-stats')
 * @Cache({ policy: oneDayCache })
 * getDailyStats() {
 *   return restful<Stats>();
 * }
 * ```
 */
declare const CachePolicies: {
    /**
     * No caching policy - all requests bypass the cache.
     *
     * Use this when you need to ensure data is always fresh,
     * or to disable caching for specific endpoints.
     */
    readonly NoCache: {
        readonly name: "NoCache";
        readonly shouldCache: () => boolean;
        readonly getTTL: () => number;
        readonly isValid: () => boolean;
    };
    /**
     * Default caching policy - caches responses for 5 minutes.
     *
     * A reasonable default for most API endpoints that don't require
     * real-time data but benefit from reduced server load.
     */
    readonly Default: CachePolicy;
    /**
     * Factory function to create custom time-based caching policies.
     *
     * @see {@link createTimeBasedPolicy} for documentation and examples
     */
    readonly createTimeBasedPolicy: typeof createTimeBasedPolicy;
};

declare const DEFAULT_CACHE_CONFIG: CacheConfig;

export { AbortError, type AdapterOptions, type AnyResource, BadGatewayError, BadRequestError, type ByteStream, Cache, type CacheConfig, type CacheEntry, CacheInterceptor, CachePolicies, type CachePolicy, type CalculateDelay, CancellationError, type CircuitBreakerConfig, CircuitBreakerError, CircuitBreakerInterceptor, type CompletionHandler, ConflictError, type CookieItem, DEFAULT_CACHE_CONFIG, Defer, Delete, type DeleteRequestOptions, type DisposableHandler, EXECUTE, Endpoint, type EndpointInstance, ErrorContextInterceptor, type EventListener, Events, type ExecuteRequestMethodParams, ExpectationFailedError, FailedDependencyError, FetchRequestAdapter, ForbiddenError, GatewayTimeoutError, Get, type GetRequestOptions, GoneError, HTTPVersionNotSupportedError, Header, HttpError, HttpHeaders, type HttpMethod, HttpResponse, type HttpResponseInit, type HttpSource, HttpStatusError, ImATeapotError, InsufficientStorageError, type Interceptor, type InterceptorConstructor, type InterceptorNextFunction, type InterceptorTypeIdentifier, InternalServerError, Key, LengthRequiredError, LockedError, LoopDetectedError, MaxRetryAttemptsReachedError, MethodNotAllowedError, MisdirectedRequestError, NetworkAuthenticationRequiredError, NetworkError, NotAcceptableError, NotExtendedError, NotFoundError, NotImplementedError, ParseError, PathVariable, Payload, PayloadTooLargeError, PaymentRequiredError, Post, type PostRequestOptions, PreconditionFailedError, PreconditionRequiredError, Progress, type ProgressHandler, PromiseStatus, ProxyAuthenticationRequiredError, Put, type PutRequestOptions, Query, type R, RangeNotSatisfiableError, type Reactive, Request, type RequestAdapter, type RequestAdapterConstructor, RequestHeaderFieldsTooLargeError, RequestMethod, type RequestOptions, RequestStatus, RequestTimeoutError, Resource, ResourceError, RestfulResource, type RetryConfig, RetryInterceptor, type RevalidateOptions, SETUP, SET_DATA, SET_ERROR, SWR, type SWRConfig, type SWRDecoratorConfig, SWRInstance, SWRMutation, type SWROptions, type SWRRefreshConfig, type SWRResponse, type SWRRetryConfig, type SWRRetryContext, type SWRState, type SWRThrottleConfig, ServerError, ServiceUnavailableError, type TimeoutConfig, TimeoutError, TimeoutInterceptor, TooEarlyError, TooManyRequestsError, URITooLongError, UnauthorizedError, UnavailableForLegalReasonsError, UnprocessableEntityError, UnsupportedMediaTypeError, UpgradeRequiredError, VariantAlsoNegotiatesError, XMLHttpRequestAdapter, buildEndpointClass, createRequestDecorator, download, isInterceptor, isInterceptorConstructor, isURL, joinPath, jsonsse, mergeAbortSignal, parseHeaders, resolveURL, restful, upload };
