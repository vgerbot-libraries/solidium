import { HttpRequest } from '../types/HttpRequest';
import { HttpEventType } from './HttpEventMap';

export abstract class HttpEvent {
    abstract readonly type: HttpEventType;
    constructor(public readonly request: HttpRequest) {}
}
