import { RestfulResource } from "../resource/RestfulResource";
import { execute } from "./execute";

/**
 * Executes a RESTful HTTP request and returns a reactive resource.
 *
 * This is the primary execution function for standard REST API calls (GET, POST, PUT, DELETE).
 * It returns a {@link RestfulResource} that provides reactive state management and integrates
 * with SWR (stale-while-revalidate) pattern when configured.
 *
 * The returned resource exposes:
 * - `data`: The response data (reactive)
 * - `error`: Any error that occurred (reactive)
 * - `loading`: Loading state indicator (reactive)
 * - `success`: Success state indicator (reactive)
 * - `failure`: Failure state indicator (reactive)
 * - `reload()`: Method to manually reload the request
 * - `wait()`: Promise that resolves when the request completes
 *
 * @template T - The expected response data type
 * @template A - The arguments tuple type (automatically inferred)
 * @param args - Arguments to pass through to the execution context (typically unused in the function body)
 *
 * @returns A reactive {@link RestfulResource} containing request state and data
 *
 * @example
 * Basic usage with GET request:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 *
 * // In component:
 * const api = useService(UserAPI);
 * const resource = api.getUser('123');
 *
 * // Access reactive state:
 * createEffect(() => {
 *   if (resource.loading) console.log('Loading...');
 *   if (resource.success) console.log('User:', resource.data);
 *   if (resource.failure) console.log('Error:', resource.error);
 * });
 * ```
 *
 * @example
 * With POST request:
 * ```typescript
 * @Post('/users')
 * createUser(@Payload() user: CreateUserDto) {
 *   return restful<User>(user);
 * }
 *
 * // Usage:
 * const resource = api.createUser({ name: 'John', email: 'john@example.com' });
 * await resource.wait(); // Wait for completion
 * ```
 *
 * @example
 * With SWR pattern:
 * ```typescript
 * @Get('/users/{id}')
 * @SWR({ revalidate: { focus: true } })
 * getUser(@PathVariable('id') id: string) {
 *   return restful<User>(id);
 * }
 * // Automatically revalidates when window regains focus
 * ```
 */
export function restful<T, A extends unknown[] = unknown[]>(...args: A) {
	return execute<T, RestfulResource<T>>(args, RestfulResource);
}
