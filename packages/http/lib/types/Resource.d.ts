import { HTTPError } from '../error/HTTPError';
import { FetchResourceOptions } from './FetchResourceOptions';
import { HttpResponse } from './HttpResponse';
export interface Resource<T extends HttpResponse = HttpResponse> {
    readonly idle: boolean;
    readonly pending: boolean;
    readonly success: boolean;
    readonly failure: boolean;
    readonly completed: boolean;
    readonly response: T | undefined;
    readonly responsePromise: Promise<T>;
    readonly error: HTTPError | undefined;
    fetch(options: FetchResourceOptions): Promise<void>;
}
