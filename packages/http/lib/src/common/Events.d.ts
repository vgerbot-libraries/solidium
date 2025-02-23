export type EventListener = (...args: any[]) => void;
export declare class Events {
    private readonly listeners;
    on(event: string, listener: EventListener): () => void;
    emit(event: string, ...args: unknown[]): void;
}
