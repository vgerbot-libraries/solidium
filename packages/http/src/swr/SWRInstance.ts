import { Events } from "../common/Events";
import type { SWRConfig, SWRRetryContext } from "./SWRConfig";

/**
 * Represents the current state of an SWR cache instance.
 *
 * @template T - The type of cached data
 */
export interface SWRState<T> {
	/** The cached data, undefined if not yet fetched or if an error occurred */
	data?: T;
	/** The error that occurred during fetching, if any */
	error?: Error;
	/** Whether the initial fetch is in progress */
	isLoading: boolean;
	/** Whether a revalidation (background fetch) is in progress */
	isValidating: boolean;
	/** The reason for the current revalidation (e.g., 'focus', 'reconnect') */
	validatingReason?: string;
}

/**
 * Extended SWR state with mutation and revalidation methods.
 *
 * @template T - The type of cached data
 */
export interface SWRResponse<T> extends SWRState<T> {
	/** Manually update the cached data and trigger revalidation */
	mutate: (data?: T) => void;
	/** Manually trigger revalidation with an optional reason */
	revalidate: (reason?: string) => Promise<void>;
}

/**
 * Options for creating an SWR instance.
 *
 * Extends {@link SWRConfig} with optional initial data.
 */
export interface SWROptions extends Partial<SWRConfig> {
	/** Initial data to populate the cache before the first fetch */
	initialData?: unknown;
}

const defaultConfig: SWRConfig = {
	revalidate: {
		focus: true,
		reconnect: true,
		ifStale: true,
		events: [],
	},
	dedupingInterval: 2000,
	staleTime: 0,
	retry: {
		maxAttempts: 3,
		interval: 1000,
		calculateDelay: (attempt: number) => {
			const baseInterval = 1000;
			const maxInterval = 30000;
			const jitter = Math.random() * 100;
			return Math.min(baseInterval * 2 ** (attempt - 1), maxInterval) + jitter;
		},
		shouldRetryOnError: (ctx: SWRRetryContext) => {
			return ctx.attempt <= 3;
		},
	},
	refresh: {
		interval: 0,
		whenHidden: false,
		whenOffline: false,
	},
};
const STATE_CHANGE_EVENT = "stateChange";
const ERROR_EVENT = "error";
const SUCCESS_EVENT = "success";

/**
 * Manages the lifecycle and state of a single SWR (Stale-While-Revalidate) cache entry.
 *
 * An SWR instance represents a single cached API request with its associated configuration.
 * It handles:
 * - Initial data fetching and loading state
 * - Automatic revalidation on focus, reconnect, or custom events
 * - Background revalidation while serving stale data
 * - Request deduplication to prevent redundant fetches
 * - Error retry with exponential backoff
 * - Automatic polling/refresh at intervals
 * - Manual cache mutation and revalidation
 *
 * Instances are typically created and managed automatically by the {@link SWR} decorator
 * through the {@link SWRService}, but can also be created manually for advanced use cases.
 *
 * @template T - The type of data managed by this SWR instance
 *
 * @example
 * Automatic usage via decorator (recommended):
 * ```typescript
 * @Get('/users/{id}')
 * @SWR({ revalidate: { focus: true } })
 * getUser(@PathVariable('id') id: string) {
 *   return restful<User>(id);
 * }
 *
 * // SWRInstance is created and managed automatically
 * const resource = api.getUser('123');
 * ```
 *
 * @example
 * Manual instance creation (advanced):
 * ```typescript
 * const swrInstance = new SWRInstance<User>(
 *   'user-123',
 *   async (key) => {
 *     const response = await fetch(`/api/users/${key.split('-')[1]}`);
 *     return response.json();
 *   },
 *   {
 *     revalidate: { focus: true, reconnect: true },
 *     staleTime: 60000
 *   }
 * );
 *
 * // Listen to state changes
 * swrInstance.onStateChange((state) => {
 *   console.log('Data:', state.data);
 *   console.log('Loading:', state.isLoading);
 * });
 * ```
 */
export class SWRInstance<T> {
	private readonly config: SWROptions;
	private state: SWRState<T>;
	private lastFetchTime: number = 0;
	private currentRetryAttempt: number = 0;
	private refreshInterval?: number;
	private readonly cleanupFns: Array<() => void> = [];
	private readonly abortController = new AbortController();
	private get signal() {
		return this.abortController.signal;
	}
	private events = new Events();
	constructor(
		public readonly key: string,
		private readonly fetcher: (key: string) => Promise<T>,
		readonly options: SWROptions = {},
	) {
		this.config = { ...defaultConfig, ...options };
		this.state = {
			data: options.initialData,
			isLoading: true,
			isValidating: false,
		} as SWRState<T>;

		this.initRevalidationStrategy();
		this.setupRefreshInterval();
	}
	onStateChange(listener: (state: SWRState<T>) => void) {
		return this.events.on(STATE_CHANGE_EVENT, listener);
	}
	private setState(newState: Partial<SWRState<T>>) {
		this.state = { ...this.state, ...newState };
		this.events.emit(STATE_CHANGE_EVENT, this.state);
	}

	private async revalidate(reason?: string) {
		const now = Date.now();

		// Deduping
		const dedupingInterval = this.config.dedupingInterval ?? 2000;
		if (now - this.lastFetchTime < dedupingInterval) {
			return;
		}

		this.setState({ isValidating: true, validatingReason: reason });
		this.lastFetchTime = now;

		try {
			const newData = await this.fetcher(this.key);
			this.setState({
				data: newData,
				error: undefined,
				isLoading: false,
				isValidating: false,
			});
			this.currentRetryAttempt = 0;
			this.events.emit(SUCCESS_EVENT, newData);
		} catch (err) {
			const error = err as Error;
			this.setState({
				error,
				isLoading: false,
				isValidating: false,
			});
			this.events.emit(ERROR_EVENT, error);

			// Retry logic
			if (
				this.config.retry &&
				this.currentRetryAttempt < this.config.retry.maxAttempts
			) {
				const retryContext: SWRRetryContext = {
					error,
					attempt: this.currentRetryAttempt + 1,
					timestamp: Date.now(),
				};

				if (this.config.retry.shouldRetryOnError?.(retryContext) !== false) {
					this.currentRetryAttempt++;
					const delay =
						this.config.retry.calculateDelay?.(
							this.currentRetryAttempt,
							error,
						) ??
						this.config.retry.interval * 2 ** (this.currentRetryAttempt - 1);

					setTimeout(() => this.revalidate(), delay);
				}
			}
		}
	}

	private initRevalidationStrategy() {
		const { focus, reconnect, events } = this.config.revalidate ?? {};
		if (typeof window === "undefined") {
			return;
		}
		if (focus !== false) {
			window.addEventListener(
				"focus",
				() => {
					this.revalidate("focus");
				},
				{
					signal: this.signal,
				},
			);
		}
		if (reconnect) {
			window.addEventListener(
				"online",
				() => {
					this.revalidate("reconnect");
				},
				{ signal: this.signal },
			);
		}
		if (events) {
			events.forEach((event) => {
				window.addEventListener(
					event,
					() => {
						this.revalidate(event);
					},
					{ signal: this.signal },
				);
			});
		}
	}

	private setupRefreshInterval() {
		if (this.config.refresh?.interval && this.config.refresh.interval > 0) {
			this.refreshInterval = setInterval(() => {
				if (
					(document.hidden && !this.config.refresh?.whenHidden) ||
					(!navigator.onLine && !this.config.refresh?.whenOffline)
				) {
					return;
				}
				this.revalidate();
			}, this.config.refresh.interval) as unknown as number;

			this.cleanupFns.push(() => {
				if (this.refreshInterval) {
					clearInterval(this.refreshInterval);
				}
			});
		}
	}

	public mutate(data?: T) {
		if (data !== undefined) {
			this.setState({ data });
		}
		this.revalidate();
	}

	public getState(): SWRResponse<T> {
		return {
			...this.state,
			mutate: (data?: T) => this.mutate(data),
			revalidate: () => this.revalidate(),
		};
	}

	public destroy() {
		this.cleanupFns.forEach((cleanup) => cleanup());
	}
}
Object.assign(window, { SWRInstance });
