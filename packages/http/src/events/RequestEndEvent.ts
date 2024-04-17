import { HttpEvent } from './HttpEvent';

export class RequestEndEvent extends HttpEvent {
    readonly type = 'end';
}
