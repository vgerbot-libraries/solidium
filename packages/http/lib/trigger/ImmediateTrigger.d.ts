import { HttpRequestTrigger } from '../types/HttpRequestTrigger';
export declare class ImmediateTrigger implements HttpRequestTrigger {
    dispatch(requestTrigger: () => Promise<void>): () => void;
}
