import { HttpRequestTrigger } from '../types/HttpRequestTrigger';
export declare class WindowEventTrigger implements HttpRequestTrigger {
    protected eventType: string;
    constructor(eventType: string);
    dispatch(requestTrigger: (revalidate?: boolean | undefined) => Promise<void>): () => void;
}
