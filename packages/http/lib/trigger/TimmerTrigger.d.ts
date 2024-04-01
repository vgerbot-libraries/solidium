import { HttpRequestTrigger } from '../types/HttpRequestTrigger';
export declare class TimmerTrigger implements HttpRequestTrigger {
    interval: number;
    static of(interval: number): {
        new (): {
            interval: number;
            dispatch(requestTrigger: () => Promise<void>): () => void;
        };
        of(interval: number): any;
    };
    constructor(interval?: number);
    dispatch(requestTrigger: () => Promise<void>): () => void;
}
