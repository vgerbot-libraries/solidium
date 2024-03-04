import { HttpRequestTrigger } from '../types/HttpRequestTrigger';

export class IdleTrigger implements HttpRequestTrigger {
    private isStopped = false;
    start(
        requestTrigger: (revalidate?: boolean | undefined) => Promise<void>
    ): void {
        requestIdleCallback(() => {
            if (this.isStopped) return;
            requestTrigger();
        });
    }
    stop(): void {
        this.isStopped = true;
    }
}
