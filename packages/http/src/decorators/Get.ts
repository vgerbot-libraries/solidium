import { createRequestDecorator, RequestOptions } from './Request';

/**
 * Options for configuring a GET request, excluding the HTTP method.
 */
export type GetRequestOptions = Omit<RequestOptions, 'method'>;

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
export function Get(options: string | GetRequestOptions) {
    return createRequestDecorator(options, 'GET');
}
