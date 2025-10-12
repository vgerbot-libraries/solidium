/**
 * Example mock endpoints demonstrating various error scenarios
 */
export default [
    {
        method: 'get',
        path: '/api/error/400',
        description: 'Return 400 Bad Request',
        handler: (ctx) => {
            ctx.status = 400;
            ctx.body = {
                status: 'error',
                code: 'BAD_REQUEST',
                message: 'The request was invalid or cannot be served.'
            };
        }
    },
    {
        method: 'get',
        path: '/api/error/401',
        description: 'Return 401 Unauthorized',
        handler: (ctx) => {
            ctx.status = 401;
            ctx.body = {
                status: 'error',
                code: 'UNAUTHORIZED',
                message: 'Authentication is required and has failed or has not been provided.'
            };
        }
    },
    {
        method: 'get',
        path: '/api/error/403',
        description: 'Return 403 Forbidden',
        handler: (ctx) => {
            ctx.status = 403;
            ctx.body = {
                status: 'error',
                code: 'FORBIDDEN',
                message: 'The server understood the request, but refuses to authorize it.'
            };
        }
    },
    {
        method: 'get',
        path: '/api/error/404',
        description: 'Return 404 Not Found',
        handler: (ctx) => {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                code: 'NOT_FOUND',
                message: 'The requested resource could not be found.'
            };
        }
    },
    {
        method: 'get',
        path: '/api/error/429',
        description: 'Return 429 Too Many Requests',
        handler: (ctx) => {
            ctx.status = 429;
            ctx.set('Retry-After', '60');
            ctx.body = {
                status: 'error',
                code: 'TOO_MANY_REQUESTS',
                message: 'You have exceeded the rate limit. Please try again later.',
                retryAfter: 60
            };
        }
    },
    {
        method: 'get',
        path: '/api/error/500',
        description: 'Return 500 Internal Server Error',
        handler: (ctx) => {
            ctx.status = 500;
            ctx.body = {
                status: 'error',
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unexpected error occurred on the server.'
            };
        }
    },
    {
        method: 'get',
        path: '/api/error/503',
        description: 'Return 503 Service Unavailable',
        handler: (ctx) => {
            ctx.status = 503;
            ctx.set('Retry-After', '120');
            ctx.body = {
                status: 'error',
                code: 'SERVICE_UNAVAILABLE',
                message: 'The server is currently unavailable. Please try again later.',
                retryAfter: 120
            };
        }
    },
    {
        method: 'get',
        path: '/api/error/timeout',
        description: 'Simulate a timeout by delaying response',
        delay: 10000, // 10 seconds
        handler: (ctx) => {
            ctx.body = {
                status: 'success',
                message: 'This response was delayed by 10 seconds'
            };
        }
    },
    {
        method: 'get',
        path: '/api/error/malformed-json',
        description: 'Return malformed JSON response',
        handler: (ctx) => {
            ctx.type = 'application/json';
            ctx.body = '{malformed: json data: this will cause parsing errors';
        }
    }
];
//# sourceMappingURL=error-scenarios.mock.js.map