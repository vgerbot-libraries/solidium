/**
 * Type for parameters that support reactive values in endpoint methods.
 *
 * This type allows endpoint method parameters to accept three forms:
 * 1. **Direct value**: A static value of type `T`
 * 2. **Undefined**: Explicitly undefined for optional parameters
 * 3. **Accessor function**: A function returning `T | undefined` (Solid.js signal/memo)
 *
 * This enables seamless integration with Solid.js's reactivity system, where parameters
 * can be either static values or reactive signals that automatically trigger re-execution
 * when their values change.
 *
 * @template T - The underlying value type
 *
 * @example
 * Using static values:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   getUser(@PathVariable('id') userId: R<string>) {
 *     return restful<User>(userId);
 *   }
 * }
 *
 * // Static value
 * const resource = api.getUser('123');
 * ```
 *
 * @example
 * Using reactive signals (Solid.js):
 * ```typescript
 * function UserProfile() {
 *   const [userId, setUserId] = createSignal('123');
 *   const api = useService(UserAPI);
 *
 *   // Pass signal accessor - automatically refetches when userId changes
 *   const userResource = api.getUser(userId);
 *
 *   return (
 *     <div>
 *       <input
 *         value={userId()}
 *         onInput={(e) => setUserId(e.target.value)}
 *       />
 *       <div>Name: {userResource.data?.name}</div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * Multiple reactive parameters:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class PostAPI {
 *   @Get('/posts')
 *   getPosts(
 *     @Query('page') page: R<number>,
 *     @Query('limit') limit: R<number>,
 *     @Query('search') search: R<string>
 *   ) {
 *     return restful<Post[]>(page, limit, search);
 *   }
 * }
 *
 * // In component
 * function PostList() {
 *   const [page, setPage] = createSignal(1);
 *   const [search, setSearch] = createSignal('');
 *   const api = useService(PostAPI);
 *
 *   // Automatically refetches when page or search changes
 *   const posts = api.getPosts(page, () => 20, search);
 *
 *   return <div>...</div>;
 * }
 * ```
 *
 * @example
 * With optional parameters:
 * ```typescript
 * @Get('/users/{id}')
 * getUser(
 *   @PathVariable('id') userId: R<string>,
 *   @Header('Authorization') token?: R<string>
 * ) {
 *   return restful<User>(userId, token);
 * }
 *
 * // Can pass undefined for optional parameters
 * const resource = api.getUser('123', undefined);
 * ```
 */
export type Reactive<T> = T | undefined | (() => T | undefined);

/**
 * Shorthand alias for {@link Reactive} type.
 *
 * Use this concise form in parameter declarations for better readability.
 * It has exactly the same behavior as `Reactive<T>`.
 *
 * @template T - The underlying value type
 *
 * @example
 * ```typescript
 * // These are equivalent:
 * getUser(@PathVariable('id') id: Reactive<string>)
 * getUser(@PathVariable('id') id: R<string>)
 * ```
 *
 * @see {@link Reactive} for detailed documentation and examples
 */
export type R<T> = Reactive<T>;
