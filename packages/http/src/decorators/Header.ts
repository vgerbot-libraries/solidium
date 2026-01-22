import { appendExecHandler } from "../common/appendExecHandler";

/**
 * Parameter decorator that binds a method parameter to an HTTP request header.
 *
 * Use this decorator to dynamically set HTTP headers based on method parameters.
 * This is useful for headers that vary per request, such as authorization tokens,
 * custom API keys, or content negotiation headers.
 *
 * @param name - The name of the HTTP header (e.g., 'Authorization', 'X-API-Key')
 * @param defaultValue - Optional default value(s) to use if the parameter is undefined
 *
 * @example
 * Dynamic authorization header:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   getUser(
 *     @PathVariable('id') id: string,
 *     @Header('Authorization') token: string
 *   ) {
 *     return restful<User>(id, token);
 *   }
 * }
 *
 * // Usage:
 * api.getUser('123', 'Bearer abc123');
 * // GET /users/123
 * // Authorization: Bearer abc123
 * ```
 *
 * @example
 * With default value:
 * ```typescript
 * @Get('/data')
 * getData(
 *   @Header('Accept', 'application/json') accept?: string
 * ) {
 *   return restful<Data>(accept);
 * }
 * ```
 *
 * @example
 * Multiple header values:
 * ```typescript
 * @Get('/data')
 * getData(
 *   @Header('Accept') acceptTypes: string[]
 * ) {
 *   return restful<Data>(acceptTypes);
 * }
 *
 * // Usage:
 * api.getData(['application/json', 'application/xml']);
 * ```
 *
 * @returns A parameter decorator
 */
export function Header(name: string, defaultValue?: string | string[]) {
	return (target: object, methodName: string, parameterIndex: number) => {
		appendExecHandler(
			target.constructor,
			methodName,
			(_instance, _metadata, params, args) => {
				const value =
					(args[parameterIndex] as string | string[] | undefined) ??
					defaultValue;
				if (value) {
					params.headers.append(
						name,
						...(Array.isArray(value) ? value : [value]),
					);
				}
			},
		);
	};
}
