import { HttpRequest } from '../types/HttpRequest';
import { HttpResponse } from '../types/HttpResponse';
export declare class HTTPError {
    readonly message: string;
    readonly request: HttpRequest;
    readonly response: HttpResponse | undefined;
    readonly reason: Error | undefined;
    constructor(message: string, request: HttpRequest, response: HttpResponse | undefined, reason: Error | undefined);
    toJSON<T>(): Promise<T | undefined>;
    toText(): Promise<string | undefined>;
}
