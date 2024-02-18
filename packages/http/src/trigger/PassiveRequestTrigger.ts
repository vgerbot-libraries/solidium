import { HttpRequestTrigger } from '../types/HttpRequestTrigger';

export class PassiveTrigger implements HttpRequestTrigger {
    start(): void {
        // PASS
    }
    stop(): void {
        // PASS
    }
}
