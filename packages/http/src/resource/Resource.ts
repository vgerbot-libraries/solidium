import { type ApplicationContext, Inject, PostInject } from "@vgerbot/ioc";
import { Signal } from "@vgerbot/solidium";
import {
	lastValueFrom,
	type Observer,
	ReplaySubject,
	switchMap,
	take,
} from "rxjs";
import { mergeAbortSignal } from "../common/mergeAbortSignal";
import { isJSON, isText, isTextEventStream } from "../common/mime-utils";
import type { EndpointInstance } from "../core/EndpointInstance";
import type { ExecuteRequestMethodParams } from "../core/ExecuteRequestParams";
import type { ExecutionContext } from "../core/execution-context";
import type { HttpResponse } from "../core/HttpResponse";
import type { RequestMethod } from "../core/RequestMethod";
import { ParseError } from "../errors/HttpError";
import { HttpStatusErrorFactory } from "../errors/HttpStatusErrorFactory";
import { RequestStatus } from "./RequestStatus";
import { ResourceError } from "./ResourceError";
import { ResourceExecutionState } from "./ResourceExecutionState";

/**
 * @internal Symbol for executing the resource
 */
export const EXECUTE = Symbol("execute");
/**
 * @internal Symbol for setting data
 */
export const SET_DATA = Symbol("setData");
/**
 * @internal Symbol for setting error
 */
export const SET_ERROR = Symbol("setError");
/**
 * @internal Symbol for setup
 */
export const SETUP = Symbol("setup");

/**
 * Type alias for a Resource with any data type.
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyResource = Resource<any, unknown>;

/**
 * Abstract base class for all HTTP request resources.
 *
 * A Resource represents an HTTP request with reactive state management, providing:
 * - **Reactive state**: All state properties (data, loading, error, etc.) are reactive signals
 * - **Observable pattern**: Subscribe to state changes via RxJS Observables
 * - **Promise interface**: Wait for completion with `wait()` method
 * - **Lifecycle management**: Automatic abort controller and cleanup
 * - **Type safety**: Strong TypeScript typing for request/response data
 *
 * The Resource class is the foundation of the library's reactive HTTP layer, integrating
 * seamlessly with Solid.js components through signal-based reactivity.
 *
 * Resource lifecycle states (exposed as reactive properties):
 * - `idle`: Initial state before request starts
 * - `loading`: Request is in progress
 * - `opened`: Connection established (for streaming)
 * - `success`: Request completed successfully
 * - `failure`: Request failed with an error
 * - `aborted`: Request was aborted
 *
 * Specialized resource types:
 * - {@link RestfulResource}: Standard REST API calls with optional SWR
 * - {@link DownloadResource}: File downloads with progress tracking
 * - {@link UploadResource}: File uploads with progress tracking
 * - {@link JSONSSEResource}: Server-Sent Events with JSON parsing
 * - {@link TextSSEResource}: Server-Sent Events with text streaming
 *
 * @template T - The type of data returned by the request
 * @template B - The type of error body (defaults to unknown)
 *
 * @example
 * Using a resource in a Solid component:
 * ```typescript
 * function UserProfile(props: { userId: string }) {
 *   const api = useService(UserAPI);
 *   const userResource = api.getUser(props.userId);
 *
 *   return (
 *     <Show
 *       when={!userResource.loading}
 *       fallback={<div>Loading...</div>}
 *     >
 *       <Show
 *         when={userResource.success}
 *         fallback={<div>Error: {userResource.error?.message}</div>}
 *       >
 *         <div>Name: {userResource.data?.name}</div>
 *       </Show>
 *     </Show>
 *   );
 * }
 * ```
 *
 * @example
 * Subscribing to state changes:
 * ```typescript
 * const resource = api.getData();
 *
 * resource.subscribe((state) => {
 *   console.log('State changed:', {
 *     loading: state.loading,
 *     data: state.data,
 *     error: state.reason
 *   });
 * });
 * ```
 *
 * @example
 * Waiting for completion:
 * ```typescript
 * const resource = api.createUser(userData);
 *
 * try {
 *   const state = await resource.wait();
 *   if (state.success) {
 *     console.log('User created:', state.data);
 *   }
 * } catch (error) {
 *   console.error('Failed to create user:', error);
 * }
 * ```
 *
 * @example
 * Manual reload:
 * ```typescript
 * const resource = api.getData();
 *
 * // Later, reload the data
 * resource.reload(true); // force=true bypasses cache
 * ```
 */
export abstract class Resource<T, B = unknown> {
	private readonly $state = new ReplaySubject<ResourceExecutionState<T, B>>(1);
	@Signal()
	protected state?: ResourceExecutionState<T, B>;
	@Inject()
	protected ioc!: ApplicationContext;

	get data(): T | undefined {
		return this.state?.data;
	}
	get error(): ResourceError<B> | undefined | null {
		return this.state?.reason;
	}
	get messages(): T[] {
		return this.state?.messages ?? [];
	}

	get idle() {
		return this.state ? this.state.idle : true;
	}
	get opened() {
		return this.state ? this.state.opened : false;
	}
	get loading() {
		return this.state ? this.state.loading : false;
	}
	get success() {
		return this.state ? this.state.success : false;
	}
	get aborted() {
		return this.state ? this.state.aborted : false;
	}
	get failure() {
		return this.state ? this.state.failure : false;
	}

	protected readonly abortController = new AbortController();
	protected context?: ExecutionContext;

	@PostInject()
	protected init() {
		this.$state.subscribe({
			next: (value) => {
				this.state = value;
			},
		});
	}

	[SETUP](context: ExecutionContext) {
		if (this.context) {
			throw new Error("Unknown Error: Cannot setup resource more than once");
		}
		this.context = context;
	}

	wait() {
		return lastValueFrom(
			this.$state.pipe(
				switchMap((state) => state),
				take(1),
			),
		);
	}
	subscribe(
		observerOrNext?:
			| Partial<Observer<ResourceExecutionState<T, B>>>
			| ((value: ResourceExecutionState<T, B>) => void),
	) {
		return this.$state.subscribe(observerOrNext);
	}
	async reload(force: boolean = false) {
		if (this.context) {
			return this[EXECUTE](force);
		}
	}

	protected [EXECUTE](
		force: boolean = false,
		state = this.ioc.getInstance(
			ResourceExecutionState,
		) as ResourceExecutionState<T, B>,
	) {
		const context = this.context;
		if (!context) {
			throw new Error("Execution context is not setup!");
		}
		const lastExecutionAbortController = this.state?.abortController;
		lastExecutionAbortController?.abort();

		this.$state.next(state);

		const { instance, method, params } = context;
		// Add force parameter to the request params
		const requestParams = {
			...params,
			force,
		};
		state.status = RequestStatus.LOADING;
		let signal = params.signal;
		if (signal) {
			signal = mergeAbortSignal(params.signal, this.abortController.signal);
		} else {
			signal = lastExecutionAbortController
				? mergeAbortSignal(
						lastExecutionAbortController.signal,
						this.abortController.signal,
					)
				: this.abortController.signal;
		}
		const allInterceptors = method.getAllInterceptors(instance);
		const sendRequest = allInterceptors.reduceRight(
			(next, interceptor) =>
				(
					instance: EndpointInstance,
					method: RequestMethod,
					params: ExecuteRequestMethodParams,
				) => {
					return interceptor.invoke(instance, method, params, next);
				},
			async (
				instance: EndpointInstance,
				method: RequestMethod,
				params: ExecuteRequestMethodParams,
			): Promise<HttpResponse> => {
				state.status = RequestStatus.OPENED;
				const response = await method.invoke(instance, {
					...params,
					signal,
				});
				state.status = RequestStatus.LOADING;
				return response;
			},
		);
		sendRequest(instance, method, requestParams)
			.then((response) => {
				return this.handleResponse(response, state);
			})
			.catch((error) => {
				state.error(ResourceError.wrap(error));
			});
	}
	protected async *resolveResponseBody(response: HttpResponse) {
		const headers = await response.headers();
		const contentType = headers.get("content-type")?.join(", ");
		if (isJSON(contentType)) {
			try {
				yield await response.json();
			} catch (error) {
				// Handle JSON parsing error
				if (error instanceof SyntaxError) {
					const parseError = new ParseError(
						"Failed to parse JSON response",
						error,
					);
					throw parseError;
				}
				throw error;
			}
		} else if (isText(contentType)) {
			yield response.text();
		} else if (isTextEventStream(contentType)) {
			yield* response.textStream();
		} else {
			const byteStream = await response.body();
			yield byteStream.readAsBlob();
		}
	}
	protected async handleResponse(
		response: HttpResponse,
		state: ResourceExecutionState<T, B>,
	): Promise<void> {
		const httpStatus = await response.status();
		state.headerReceived(await response.headers(), httpStatus);
		if (httpStatus < 200 || httpStatus >= 400) {
			await this.handleHttpErrorResponse(response);
		} else {
			for await (const data of this.resolveResponseBody(response)) {
				state.next(data as T);
			}
			state.status = RequestStatus.SUCCESS;
			state.complete();
		}
	}
	protected async handleHttpErrorResponse(
		response: HttpResponse,
	): Promise<void> {
		const httpStatus = await response.status();
		const headers = await response.headers();
		const contentType = headers.get("content-type")?.join(", ");
		const datas = [];
		for await (const data of this.resolveResponseBody(response)) {
			datas.push(data);
		}
		const responseBody = isTextEventStream(contentType) ? datas : datas[0];

		// Use the factory to create the appropriate HTTP status error
		const httpError = HttpStatusErrorFactory.createError(
			httpStatus,
			response.init.method.toString(),
			headers,
			responseBody,
		);

		throw httpError;
	}
}
