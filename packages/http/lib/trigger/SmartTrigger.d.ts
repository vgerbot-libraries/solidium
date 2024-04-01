import { HttpRequestTrigger } from '../types/HttpRequestTrigger';
import { HttpRequestTriggerOptions } from '../types/HttpRequestTriggerOptions';
export declare class SmartTrigger implements HttpRequestTrigger {
    private triggers;
    constructor({ immediate, idle, interval, onFocus, onOnline }: HttpRequestTriggerOptions);
    dispatch(requestTrigger: () => Promise<void>): () => void;
}
