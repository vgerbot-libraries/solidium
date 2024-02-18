export interface HttpRequestTrigger {
    start(requestTrigger: () => Promise<void>): void;
    stop(): void;
}
