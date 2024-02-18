import { HttpRequestTrigger } from '../types/HttpRequestTrigger';

export class WindowFocusTrigger implements HttpRequestTrigger {
    private isStopped = false;
    start(requestTrigger: () => Promise<void>): void {
        requestAnimationFrame(() => {
            if (this.isStopped) {
                return;
            }
            requestTrigger();
        });
    }
    stop(): void {
        this.isStopped = true;
    }
}
