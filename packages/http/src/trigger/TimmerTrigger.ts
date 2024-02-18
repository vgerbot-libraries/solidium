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
    _timmerId: undefined | ReturnType<typeof setInterval>;
    start(requestTrigger: () => Promise<void>): void {
        this._timmerId = setInterval(() => {
            requestTrigger();
        }, this.interval);
    }
    stop(): void {
        clearInterval(this._timmerId);
    }
}
