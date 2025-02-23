import { SWRConfig, RevalidateStrategy } from './SWRConfig';
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
export declare class DefaultRevalidateStrategy implements RevalidateStrategy {
    private readonly options;
    constructor(options: SWRConfig['revalidate']['on']);
    invoke(revalidate: (reason?: string) => void): void;
}
export declare class SWRInstance<T> {
    readonly key: string;
    private readonly fetcher;
    private readonly options;
    private readonly config;
    private state;
    private lastFetchTime;
    private currentRetryAttempt;
    private refreshInterval?;
    private readonly cleanupFns;
    constructor(key: string, fetcher: () => Promise<T>, options?: SWROptions);
    private setState;
    private revalidate;
    private setupRevalidationStrategy;
    private setupRefreshInterval;
    mutate(data?: T): void;
    getState(): SWRResponse<T>;
    destroy(): void;
}
