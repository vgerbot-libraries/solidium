import {
	EndpointMetadata,
	type EndpointOptions,
} from "../metadata/EndpointMetadata";

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
export function Endpoint(options: EndpointOptions): ClassDecorator {
	return (target: Function) => {
		EndpointMetadata.from(target).setOptions(options);
	};
}
