import { createRequestDecorator, type RequestOptions } from "./Request";

/**
 * Options for configuring a PUT request, excluding the HTTP method.
 */
export type PutRequestOptions = Omit<RequestOptions, "method">;

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
export function Put(options: string | PutRequestOptions) {
	return createRequestDecorator(options, "PUT");
}
