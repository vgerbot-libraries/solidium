import { HttpEvent } from './HttpEvent';

export class RequestStartEvent extends HttpEvent {
    readonly type = 'start';
}
