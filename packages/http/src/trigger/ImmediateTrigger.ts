import { noop } from '../common/noop';
import { HttpRequestTrigger } from '../types/HttpRequestTrigger';

export class ImmediateTrigger implements HttpRequestTrigger {
    dispatch(requestTrigger: () => Promise<void>): () => void {
        requestTrigger();
        return noop;
    }
}
