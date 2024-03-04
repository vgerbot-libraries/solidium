export interface HttpRequestTrigger {
    start(requestTrigger: (revalidate?: boolean) => Promise<void>): void;
    stop(): void;
}
