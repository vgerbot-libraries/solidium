import { HttpEntity } from '../types/HttpEntity';
import { HttpRequest } from '../types/HttpRequest';
import { HttpResponse } from '../types/HttpResponse';

export type Resource<E extends HttpEntity = HttpEntity> = {
    readonly idle: boolean;
    readonly pending: boolean;
    readonly success: boolean;
    readonly failure: boolean;
    readonly completed: boolean;
    readonly response: HttpResponse<E> | undefined;
    readonly request: HttpRequest;
};
