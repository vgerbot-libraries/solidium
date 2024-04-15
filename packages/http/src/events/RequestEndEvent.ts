import { HttpEvent } from './HttpEvent';

export const EVENT_TYPE = Symbol('end-request-event');
export class RequestEndEvent extends HttpEvent {
    readonly type = EVENT_TYPE;
}
