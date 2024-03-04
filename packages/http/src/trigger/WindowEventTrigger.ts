import { HttpRequestTrigger } from '../types/HttpRequestTrigger';

export class WindowEventTrigger implements HttpRequestTrigger {
    constructor(protected eventType: string) {}
    private eventListener?: () => void;
    start(
        requestTrigger: (revalidate?: boolean | undefined) => Promise<void>
    ): void {
        this.eventListener = () => {
            requestTrigger(true);
        };
        window.addEventListener(this.eventType, this.eventListener);
    }
    stop(): void {
        this.eventListener &&
            window.addEventListener(this.eventType, this.eventListener);
    }
}
