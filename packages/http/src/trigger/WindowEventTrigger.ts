import { HttpRequestTrigger } from '../types/HttpRequestTrigger';

export class WindowEventTrigger implements HttpRequestTrigger {
    constructor(protected eventType: string) {}
    dispatch(
        requestTrigger: (revalidate?: boolean | undefined) => Promise<void>
    ): () => void {
        const eventListener = () => {
            requestTrigger(true);
        };
        window.addEventListener(this.eventType, eventListener);
        return () => {
            window.removeEventListener(this.eventType, eventListener);
        };
    }
}
