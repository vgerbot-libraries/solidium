import { HttpEvent } from './HttpEvent';

export const EVENT_TYPE = Symbol('REQUEST-START');

export class RequestStartEvent extends HttpEvent {
    readonly type = EVENT_TYPE;
}
