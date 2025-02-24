import {
    SWRConfig,
    RevalidateStrategy,
    SWRRetryContext,
    isRevalidateStrategyFunction
} from './SWRConfig';

export interface SWRState<T> {
    data?: T;
    error?: Error;
    isLoading: boolean;
    isValidating: boolean;
    validatingReason?: string;
}

export interface SWRResponse<T> extends SWRState<T> {
    mutate: (data?: T) => void;
    revalidate: (reason?: string) => Promise<void>;
}

export interface SWROptions extends Partial<SWRConfig> {
    initialData?: unknown;
    onSuccess?: (data: unknown) => void;
    onError?: (error: Error) => void;
    onStateChange?: (state: SWRState<unknown>) => void;
}

export class DefaultRevalidateStrategy implements RevalidateStrategy {
    constructor(private readonly options: SWRConfig['revalidate']['on']) {}
    execute(signal: AbortSignal, revalidate: (reason?: string) => void): void {
        if (typeof window !== 'undefined') {
            if (this.options.focus !== false) {
                window.addEventListener('focus', () => revalidate('focus'));
            }
            if (this.options.reconnect) {
                window.addEventListener('online', () =>
                    revalidate('reconnect')
                );
            }
            if (this.options.events) {
                this.options.events.forEach(event => {
                    window.addEventListener(event, () => {
                        revalidate(event);
                    });
                });
            }
        }
    }
}

const defaultConfig: SWRConfig = {
    revalidate: {
        on: {
            focus: true,
            reconnect: true,
            ifStale: true,
            events: []
        }
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
            return (
                Math.min(baseInterval * Math.pow(2, attempt - 1), maxInterval) +
                jitter
            );
        },
        shouldRetryOnError: (ctx: SWRRetryContext) => {
            return ctx.attempt <= 3;
        }
    },
    refresh: {
        interval: 0,
        whenHidden: false,
        whenOffline: false
    }
};

export class SWRInstance<T> {
    private readonly config: SWROptions;
    private state: SWRState<T>;
    private lastFetchTime: number = 0;
    private currentRetryAttempt: number = 0;
    private refreshInterval?: number;
    private readonly cleanupFns: Array<() => void> = [];

    constructor(
        public readonly key: string,
        private readonly signal: AbortSignal,
        private readonly fetcher: () => Promise<T>,
        private readonly options: SWROptions = {}
    ) {
        this.config = { ...defaultConfig, ...options };
        this.state = {
            data: options.initialData,
            isLoading: true,
            isValidating: false
        } as SWRState<T>;

        this.executeRevalidationStrategy();
        this.setupRefreshInterval();
        (() => {
            this.revalidate(); // Initial fetch
        })();
    }

    private setState(newState: Partial<SWRState<T>>) {
        this.state = { ...this.state, ...newState };
        this.options.onStateChange?.(this.state);
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
            const newData = await this.fetcher();
            this.setState({
                data: newData,
                error: undefined,
                isLoading: false,
                isValidating: false
            });
            this.currentRetryAttempt = 0;
            this.options.onSuccess?.(newData);
        } catch (err) {
            const error = err as Error;
            this.setState({
                error,
                isLoading: false,
                isValidating: false
            });
            this.options.onError?.(error);

            // Retry logic
            if (
                this.config.retry &&
                this.currentRetryAttempt < this.config.retry.maxAttempts
            ) {
                const retryContext: SWRRetryContext = {
                    error,
                    attempt: this.currentRetryAttempt + 1,
                    timestamp: Date.now()
                };

                if (
                    this.config.retry.shouldRetryOnError?.(retryContext) !==
                    false
                ) {
                    this.currentRetryAttempt++;
                    const delay =
                        this.config.retry.calculateDelay?.(
                            this.currentRetryAttempt,
                            error
                        ) ??
                        this.config.retry.interval *
                            Math.pow(2, this.currentRetryAttempt - 1);

                    setTimeout(() => this.revalidate(), delay);
                }
            }
        }
    }

    private executeRevalidationStrategy() {
        const revalidateOn = this.config.revalidate?.on;
        const customStrategy = this.config.revalidate?.strategy;
        let strategy: RevalidateStrategy | undefined;
        if (customStrategy) {
            strategy = isRevalidateStrategyFunction(customStrategy)
                ? { execute: customStrategy }
                : undefined;
        }
        strategy =
            strategy ??
            new DefaultRevalidateStrategy({
                focus: true,
                reconnect: true,
                ifStale: true,
                ...revalidateOn
            });
        strategy.execute(this.signal, (reason?: string) => {
            this.revalidate(reason);
        });
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
            revalidate: () => this.revalidate()
        };
    }

    public destroy() {
        this.cleanupFns.forEach(cleanup => cleanup());
    }
}
