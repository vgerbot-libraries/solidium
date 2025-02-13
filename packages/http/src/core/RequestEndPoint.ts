import { Interceptor } from './Interceptor';

interface RequestEndpointOptions {
    baseURL: string;
    timeout?: number;
    interceptors?: Array<Newable<Interceptor> | string | symbol>;
}

export class RequestEndpoint {
    public baseURL: string;
    constructor(
        options: RequestEndpointOptions,
        public parent?: RequestEndpoint
    ) {
        this.baseURL = options.baseURL ?? parent?.baseURL ?? document.baseURI;
    }
}
