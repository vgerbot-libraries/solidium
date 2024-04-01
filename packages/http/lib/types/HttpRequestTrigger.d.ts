export interface HttpRequestTrigger {
    dispatch(executeRequest: (revalidate?: boolean) => Promise<void>): () => void;
}
export declare function isTriggerInstance(value: unknown): value is HttpRequestTrigger;
