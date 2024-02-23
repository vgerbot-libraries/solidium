import { HttpConfiguration } from '../types/HttpConfiguration';
import { HttpRequest } from '../types/HttpRequest';
import { HttpRequestOptions } from '../types/HttpRequestOptions';
import { HttpResponse } from '../types/HttpResponse';
import { Resource } from '../types/Resource';

export class DataResource implements Resource {
    get idle(): boolean {
        return true;
    }
    get pending(): boolean {
        return true;
    }
    get success(): boolean {
        return true;
    }
    get failure(): boolean {
        return true;
    }
    get completed(): boolean {
        return true;
    }
    response: HttpResponse | undefined;
    request: HttpRequest;

    constructor(
        private configuration: HttpConfiguration,
        requestOptions: HttpRequestOptions
    ) {
        this.request = {} as HttpRequest;
    }
}
