declare const NOT_CHANGED_SYMBOL: unique symbol;
export declare function useComputed<T>(fn: () => T): () => typeof NOT_CHANGED_SYMBOL | T;
export {};
