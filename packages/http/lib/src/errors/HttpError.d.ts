export declare class HttpError extends Error {
    status: number;
    code: string;
    context: Record<string, unknown>;
    constructor(message: string, status: number, code: string, context: Record<string, unknown>);
}
export declare class NetworkError extends HttpError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class TimeoutError extends HttpError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class ValidationError extends HttpError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class AuthenticationError extends HttpError {
    constructor(message: string, context?: Record<string, unknown>);
}
export declare class ApiError extends HttpError {
    constructor(message: string, status: number, code: string, context?: Record<string, unknown>);
}
