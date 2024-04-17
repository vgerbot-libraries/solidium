import { HttpEvent } from './HttpEvent';

export class TimeoutEvent extends HttpEvent {
    readonly type = 'timeout';
}
