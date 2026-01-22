import { appendExecHandler } from "../common/appendExecHandler";

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
export function Query(
	name: string,
	defaultValue?: string | number | boolean | Array<string | number | boolean>,
) {
	return (target: object, methodName: string, parameterIndex: number) => {
		appendExecHandler(
			target.constructor,
			methodName,
			(_instance, _metadata, params, args) => {
				const value = args[parameterIndex] ?? defaultValue;
				if (Array.isArray(value)) {
					value.forEach((value) => {
						params.queryParams.append(name, value);
					});
				} else if (value !== null && value !== undefined) {
					params.queryParams.set(name, `${value}`);
				}
			},
		);
	};
}
