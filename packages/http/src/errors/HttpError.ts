export class HttpError extends Error {
    constructor(
        message: string,
        public status: number,
        public code: string,
        public context: Record<string, unknown>
    ) {
        super(message);
        this.name = 'HttpError';
    }
}

export class NetworkError extends HttpError {
    constructor(message: string, context: Record<string, unknown> = {}) {
        super(message, 0, 'NETWORK_ERROR', context);
        this.name = 'NetworkError';
    }
}

export class TimeoutError extends HttpError {
    constructor(message: string, context: Record<string, unknown> = {}) {
        super(message, 408, 'REQUEST_TIMEOUT', context);
        this.name = 'TimeoutError';
    }
}

export class ValidationError extends HttpError {
    constructor(message: string, context: Record<string, unknown> = {}) {
        super(message, 400, 'VALIDATION_ERROR', context);
        this.name = 'ValidationError';
    }
}

export class AuthenticationError extends HttpError {
    constructor(message: string, context: Record<string, unknown> = {}) {
        super(message, 401, 'AUTHENTICATION_ERROR', context);
        this.name = 'AuthenticationError';
    }
}

export class ApiError extends HttpError {
    constructor(
        message: string,
        status: number,
        code: string,
        context: Record<string, unknown> = {}
    ) {
        super(message, status, code, context);
        this.name = 'ApiError';
    }
}
