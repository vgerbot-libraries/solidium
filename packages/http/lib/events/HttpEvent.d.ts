import { HttpRequest } from '../types/HttpRequest';
import { HttpEventType } from './HttpEventMap';
export declare abstract class HttpEvent {
    readonly request: HttpRequest;
    abstract readonly type: HttpEventType;
    constructor(request: HttpRequest);
}
