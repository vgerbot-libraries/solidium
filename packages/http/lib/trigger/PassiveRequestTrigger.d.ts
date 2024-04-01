import { noop } from '../common/noop';
import { HttpRequestTrigger } from '../types/HttpRequestTrigger';
export declare class PassiveTrigger implements HttpRequestTrigger {
    dispatch(): typeof noop;
}
