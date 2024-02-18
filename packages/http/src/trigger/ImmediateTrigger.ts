import { HttpRequestTrigger } from '../types/HttpRequestTrigger';

export class ImmediateTrigger implements HttpRequestTrigger {
    start(requestTrigger: () => Promise<void>): void {
        requestTrigger();
    }
    stop(): void {
        //
    }
}
