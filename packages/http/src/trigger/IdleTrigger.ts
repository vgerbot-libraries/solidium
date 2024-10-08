import { HttpRequestTrigger } from '../types/HttpRequestTrigger';

export class IdleTrigger implements HttpRequestTrigger {
    dispatch(
        requestTrigger: (revalidate?: boolean | undefined) => Promise<void>
    ): () => void {
        let stopped = false;
        requestIdleCallback(() => {
            if (stopped) return;
            return requestTrigger();
        });
        return () => {
            stopped = true;
        };
    }
}
