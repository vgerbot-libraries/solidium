/**
 * Symbol constants used for endpoint instance storage and retrieval
 */

/** Stores HTTP methods (GET, POST, etc.) associated with an endpoint */
export const METHODS: unique symbol = Symbol('endpoint-request-methods');

/** Stores interceptors that process requests/responses for an endpoint */
export const GET_INTERCEPTORS: unique symbol = Symbol(
    'endpoint-get-interceptors'
);

/** Stores the HTTP adapter configuration for an endpoint */
export const ADAPTER: unique symbol = Symbol('endpoint-adapter');

/** Stores the interceptor construction logic for an endpoint */
export const CONSTRUCT_INTERCEPTORS: unique symbol = Symbol(
    'endpoint-construct-interceptors'
);

export const ABORT_CONTROLLER = Symbol('abort-controller');

export const APPLICATION_CONTEXT = Symbol('application-context');
