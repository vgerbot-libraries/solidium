import { HttpRequest } from '../types/HttpRequest';

export abstract class HttpEvent {
    abstract readonly type: string | symbol;
    constructor(public readonly request: HttpRequest) {}
}
