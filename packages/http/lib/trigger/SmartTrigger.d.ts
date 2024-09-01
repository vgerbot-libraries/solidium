import { HttpRequestTrigger } from '../types/HttpRequestTrigger';
import { HttpRequestTriggerOptions } from '../types/HttpRequestTriggerOptions';
export declare class SmartTrigger implements HttpRequestTrigger {
    private triggers;
    constructor({ interval, onFocus, onOnline, ...remain }: HttpRequestTriggerOptions);
    dispatch(requestTrigger: () => Promise<void>): () => void;
}
