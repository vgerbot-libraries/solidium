import { createRequestDecorator, RequestOptions } from './Request';

/**
 * Options for configuring a DELETE request, excluding the HTTP method.
 */
export type DeleteRequestOptions = Omit<RequestOptions, 'method'>;

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
export function Delete(options: string | DeleteRequestOptions) {
    return createRequestDecorator(options, 'DELETE');
}
