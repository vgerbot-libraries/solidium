import { appendExecHandler } from "../common/appendExecHandler";

/**
 * Parameter decorator that binds a method parameter to a path variable in the URL.
 *
 * Use this decorator to extract values from URL path segments (e.g., `/users/{id}`).
 * The decorated parameter value will replace the corresponding placeholder in the path.
 *
 * @param name - The name of the path variable in the URL template (e.g., 'id' for '/users/{id}')
 * @param defaultValue - Optional default value to use if the parameter is undefined
 *
 * @example
 * Basic usage:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 *
 * // Usage:
 * const api = container.getInstance(UserAPI);
 * api.getUser('123'); // GET https://api.example.com/users/123
 * ```
 *
 * @example
 * With default value:
 * ```typescript
 * @Get('/users/{id}/posts/{postId}')
 * getUserPost(
 *   @PathVariable('id') userId: string,
 *   @PathVariable('postId', 'latest') postId?: string
 * ) {
 *   return restful<Post>(userId, postId);
 * }
 * ```
 *
 * @returns A parameter decorator
 */
export function PathVariable(
	name: string,
	defaultValue?: string | number | boolean,
) {
	return (target: object, methodName: string, parameterIndex: number) => {
		appendExecHandler(
			target.constructor,
			methodName,
			(_instance, _metadata, params, args) => {
				const value = args[parameterIndex];
				params.pathVariables[name] = `${value ?? defaultValue}`;
			},
		);
	};
}
