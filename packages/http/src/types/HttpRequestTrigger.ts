import { isObject } from '../common/isObject';

export interface HttpRequestTrigger {
    dispatch(
        executeRequest: (revalidate?: boolean) => Promise<void>
    ): () => void;
}
export function isTriggerInstance(value: unknown): value is HttpRequestTrigger {
    return (
        isObject<HttpRequestTrigger>(value) &&
        typeof value.dispatch === 'function'
    );
}
