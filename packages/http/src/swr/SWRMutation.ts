import { APPLICATION_CONTEXT } from '../core/EndpointMembers';
import { Interceptor } from '../core/Interceptor';
import { decorateEndpointMethod } from '../helper/decorateEndpointMethod';
import { RequestMethodMetadata } from '../metadata/RequestMethodMetadata';
import { EXTRA_METADATA_MUTATE } from './consts';
import { SWRService } from './SWRService';

/**
 * Decorator that marks a mutation method and automatically invalidates related SWR cache.
 *
 * Use this decorator on mutation methods (POST, PUT, DELETE) that modify server data.
 * After the mutation completes successfully, it automatically triggers revalidation
 * of the specified SWR cache key, ensuring that all components using that cached data
 * receive fresh updates.
 *
 * This is essential for maintaining data consistency between read and write operations
 * in applications using the SWR pattern.
 *
 * @param _keygen - Cache key identifier for the SWR instance to invalidate
 *                  - Can be a static string matching an {@link SWR} decorator's key
 *                  - Can be a function that generates the key based on method arguments
 *
 * @example
 * Basic usage with static key:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   // Read operation with SWR caching
 *   @Get('/users/{id}')
 *   @SWR({ key: 'user-profile' })
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 *
 *   // Write operation that invalidates the cache
 *   @Put('/users/{id}')
 *   @SWRMutation('user-profile')
 *   updateUser(
 *     @PathVariable('id') id: string,
 *     @Payload() data: UpdateUserDto
 *   ) {
 *     return restful<User>(id, data);
 *   }
 * }
 *
 * // Usage:
 * // 1. Initial fetch - data is cached
 * const userResource = api.getUser('123');
 *
 * // 2. Update user - cache is automatically invalidated and refetched
 * await api.updateUser('123', { name: 'Jane' }).wait();
 *
 * // 3. userResource automatically receives updated data
 * ```
 *
 * @example
 * With dynamic key generator:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class PostAPI {
 *   @Get('/users/{userId}/posts')
 *   @SWR({ key: (userId: string) => `user-${userId}-posts` })
 *   getUserPosts(@PathVariable('userId') userId: string) {
 *     return restful<Post[]>(userId);
 *   }
 *
 *   @Post('/users/{userId}/posts')
 *   @SWRMutation((userId: string) => `user-${userId}-posts`)
 *   createPost(
 *     @PathVariable('userId') userId: string,
 *     @Payload() post: CreatePostDto
 *   ) {
 *     return restful<Post>(userId, post);
 *   }
 *
 *   @Delete('/posts/{postId}')
 *   @SWRMutation((postId: string, userId: string) => `user-${userId}-posts`)
 *   deletePost(
 *     @PathVariable('postId') postId: string,
 *     @Query('userId') userId: string
 *   ) {
 *     return restful(postId, userId);
 *   }
 * }
 *
 * // When a post is created or deleted, the post list is automatically refreshed
 * ```
 *
 * @example
 * Multiple related caches:
 * ```typescript
 * // If you need to invalidate multiple caches, you can compose multiple decorators
 * // or handle it manually in the method
 * @Post('/comments')
 * @SWRMutation('comments-list')
 * createComment(@Payload() comment: CreateCommentDto) {
 *   return restful<Comment>(comment);
 * }
 * ```
 *
 * @returns A method decorator that adds cache invalidation behavior
 *
 * @see {@link SWR} for the corresponding read operation decorator
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SWRMutation(_keygen: string | ((...args: any[]) => string)) {
    return decorateEndpointMethod(
        (
            clazz: NewableFunction,
            methodName: string | symbol,
            methodMetadata: RequestMethodMetadata
        ) => {
            methodMetadata.setExtra(EXTRA_METADATA_MUTATE, true);
            methodMetadata.appendInterceptor({
                invoke: async (instance, method, params, next) => {
                    const result = await next(instance, method, params);

                    const swrService =
                        instance[APPLICATION_CONTEXT].getInstance(SWRService);
                    const args = params.args;

                    const key = (() => {
                        if (typeof _keygen === 'string') {
                            return _keygen;
                        }
                        if (typeof _keygen === 'function') {
                            return _keygen(...args);
                        }
                        return method.resolveURL(params);
                    })();
                    const swrInstance = swrService.obtainInstance(key);
                    swrInstance?.mutate();
                    return result;
                }
            } as Interceptor);
        }
    );
}
