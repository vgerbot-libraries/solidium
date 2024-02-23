import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';

export interface Resource {
    readonly idle: boolean;
    readonly pending: boolean;
    readonly success: boolean;
    readonly failure: boolean;
    readonly completed: boolean;
    readonly response: HttpResponse | undefined;
    readonly request: HttpRequest;
}
