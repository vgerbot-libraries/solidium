import { createRequestDecorator, RequestOptions } from './Request';

/**
 * Options for configuring a POST request, excluding the HTTP method.
 */
export type PostRequestOptions = Omit<RequestOptions, 'method'>;

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
export function Post(options: string | PostRequestOptions) {
    return createRequestDecorator(options, 'POST');
}
