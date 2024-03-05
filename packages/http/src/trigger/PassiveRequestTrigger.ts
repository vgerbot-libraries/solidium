import { noop } from '../common/noop';
import { HttpRequestTrigger } from '../types/HttpRequestTrigger';

export class PassiveTrigger implements HttpRequestTrigger {
    dispatch() {
        return noop;
    }
}
