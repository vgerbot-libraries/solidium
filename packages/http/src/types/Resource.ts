import { HttpRequest } from './HttpRequest';
import { HttpResponse } from './HttpResponse';

export interface Resource<T extends HttpResponse = HttpResponse> {
    readonly idle: boolean;
    readonly pending: boolean;
    readonly success: boolean;
    readonly failure: boolean;
    readonly completed: boolean;
    readonly response: T | undefined;
    readonly request: HttpRequest;
    readonly responsePromise: Promise<T>;
    refetch(force?: boolean): Promise<void>;
}
