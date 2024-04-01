import { HttpRequestTrigger } from '../types/HttpRequestTrigger';
export declare class IdleTrigger implements HttpRequestTrigger {
    dispatch(requestTrigger: (revalidate?: boolean | undefined) => Promise<void>): () => void;
}
