import { Inject, InstanceScope, Scope } from "@vgerbot/ioc";
import { lastValueFrom } from "rxjs";
import {
	EXTRA_METADATA_MUTATE,
	EXTRA_METADATA_SWR_CONFIG,
	EXTRA_METADATA_SWR_KEYGEN,
} from "../swr/consts";
import type { SWRDecoratorConfig } from "../swr/SWR";
import type { SWRConfig } from "../swr/SWRConfig";
import { SWRService } from "../swr/SWRService";
import { EXECUTE, Resource } from "./Resource";
import { ResourceExecutionState } from "./ResourceExecutionState";

/**
 * Resource implementation for standard RESTful HTTP requests.
 *
 * This is the primary resource type used by the {@link restful} execution function
 * for standard REST API calls (GET, POST, PUT, DELETE, etc.). It extends the base
 * {@link Resource} class with:
 * - SWR (Stale-While-Revalidate) integration
 * - Automatic cache management
 * - Background revalidation
 * - Cache mutation support
 *
 * When decorated with {@link SWR}, RestfulResource automatically:
 * - Caches responses based on a unique key
 * - Serves cached data immediately while revalidating in the background
 * - Revalidates on focus, reconnect, or custom events
 * - Deduplicates concurrent requests with the same key
 * - Provides automatic polling/refresh capabilities
 *
 * The resource integrates with the {@link SWRService} to manage cache instances
 * and coordinate updates across multiple components using the same data.
 *
 * @template T - The type of response data
 * @template E - The type of error body (defaults to unknown)
 *
 * @example
 * Basic RESTful request (no SWR):
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 *
 * // Usage
 * const resource = api.getUser('123');
 * // Fetches fresh data every time
 * ```
 *
 * @example
 * With SWR caching and revalidation:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   @SWR({
 *     key: (id) => `user-${id}`,
 *     revalidate: { focus: true, reconnect: true },
 *     staleTime: 60000  // Consider stale after 1 minute
 *   })
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 *
 * // First call: fetches from server
 * const resource1 = api.getUser('123');
 *
 * // Second call: returns cached data, revalidates in background
 * const resource2 = api.getUser('123');
 * ```
 *
 * @example
 * Mutation with automatic cache invalidation:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   @SWR({ key: (id) => `user-${id}` })
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 *
 *   @Put('/users/{id}')
 *   @SWRMutation((id: string) => `user-${id}`)
 *   updateUser(
 *     @PathVariable('id') id: string,
 *     @Payload() data: UpdateUserDto
 *   ) {
 *     return restful<User>(id, data);
 *   }
 * }
 *
 * // When updateUser completes, the getUser cache is automatically invalidated
 * ```
 *
 * @see {@link Resource} for the base class documentation
 * @see {@link SWR} for caching configuration
 * @see {@link SWRMutation} for cache invalidation
 * @see {@link restful} for the execution function
 */
@Scope(InstanceScope.TRANSIENT)
export class RestfulResource<T, E = unknown> extends Resource<T, E> {
	@Inject()
	private swrService!: SWRService;
	protected [EXECUTE](force = false) {
		const context = this.context;
		if (!context) {
			throw new Error("Execution context is not setup!");
		}
		const args = context.params.args;
		const methodMetadata = context.method.metadata;
		const _keygen = methodMetadata.getExtra<
			string | ((...args: unknown[]) => string) | undefined
		>(EXTRA_METADATA_SWR_KEYGEN);

		const mutate =
			methodMetadata.getExtra<boolean>(EXTRA_METADATA_MUTATE) ?? false;

		const swrConfig = methodMetadata.getExtra<SWRDecoratorConfig | undefined>(
			EXTRA_METADATA_SWR_CONFIG,
		);

		if (mutate && swrConfig) {
			throw new Error("@SWR and @SWRMutation cannot be used together");
		}

		if (!swrConfig) {
			const state = this.ioc.getInstance(
				ResourceExecutionState,
			) as ResourceExecutionState<T, E>;
			return super[EXECUTE](force, state);
		}
		const keygen = () => {
			if (typeof _keygen === "string") {
				return _keygen;
			}
			if (typeof _keygen === "function") {
				return _keygen(...args);
			}
			return context.method.resolveURL(context.params);
		};

		const instance = this.swrService.useSWR(
			keygen,
			() => {
				const state = this.ioc.getInstance(
					ResourceExecutionState,
				) as ResourceExecutionState<T, E>;
				super[EXECUTE](force, state);
				return lastValueFrom(state).then(
					() => state as ResourceExecutionState<unknown, unknown>,
				);
			},
			swrConfig as SWRConfig,
		);
		const newState = instance.getState().data as ResourceExecutionState<T, E>;
		if (newState !== this.state) {
			this.state = newState;
		}

		instance?.onStateChange((state) => {
			this.state = state.data as ResourceExecutionState<T, E>;
		});
	}
}
