import { HttpRequestTrigger } from '../types/HttpRequestTrigger';

export class TimmerTrigger implements HttpRequestTrigger {
    static of(interval: number) {
        return class extends TimmerTrigger {
            constructor() {
                super(interval);
            }
        };
    }
    constructor(public interval: number = 1000) {}
    dispatch(requestTrigger: () => Promise<void>): () => void {
        const timmerId = setInterval(() => {
            requestTrigger();
        }, this.interval);
        return () => {
            clearInterval(timmerId);
        };
    }
}
