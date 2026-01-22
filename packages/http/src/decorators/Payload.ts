import { appendExecHandler } from "../common/appendExecHandler";
import { isBodyInit } from "../common/isBodyInit";

/**
 * Parameter decorator that binds a method parameter to the HTTP request body.
 *
 * Use this decorator to specify which parameter should be sent as the request body payload.
 * The decorator automatically handles JSON serialization for plain objects and supports
 * standard body types like Blob, FormData, and ArrayBuffer.
 *
 * For plain objects, the decorator will:
 * - Automatically set `Content-Type: application/json` header
 * - JSON-stringify the object
 *
 * For BodyInit types (Blob, FormData, ArrayBuffer, etc.), the value is sent as-is.
 *
 * @example
 * Creating a resource with JSON payload:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Post('/users')
 *   createUser(@Payload() user: CreateUserDto) {
 *     return restful<User>(user);
 *   }
 * }
 *
 * // Usage:
 * api.createUser({ name: 'John', email: 'john@example.com' });
 * // POST /users
 * // Content-Type: application/json
 * // Body: {"name":"John","email":"john@example.com"}
 * ```
 *
 * @example
 * Uploading a file with FormData:
 * ```typescript
 * @Post('/users/{id}/avatar')
 * uploadAvatar(
 *   @PathVariable('id') id: string,
 *   @Payload() formData: FormData
 * ) {
 *   return upload<{ url: string }>(id, formData);
 * }
 *
 * // Usage:
 * const formData = new FormData();
 * formData.append('file', fileBlob);
 * api.uploadAvatar('123', formData);
 * ```
 *
 * @returns A parameter decorator
 */
export function Payload() {
	return (target: object, methodName: string, parameterIndex: number) => {
		appendExecHandler(
			target.constructor,
			methodName,
			(_instance, _metadata, params, args) => {
				const value = args[parameterIndex];
				if (isBodyInit(value)) {
					params.payload = value;
				} else {
					params.headers.set("Content-Type", "application/json");
					params.payload = JSON.stringify(value);
				}
			},
		);
	};
}
