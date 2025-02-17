import { RequestAdapterConstructor } from '../adapter/RequestAdapter';
import { XMLHttpRequestAdapter } from '../adapter/XMLHTTPRequestAdapter';
import { Interceptor, InterceptorFunction } from './Interceptor';

interface RequestEndpointOptions {
    baseURL: string;
    timeout?: number;
    interceptors?: Array<Interceptor | InterceptorFunction>;
    adapter?: RequestAdapterConstructor;
}

export class RequestEndpoint {
    public readonly baseURL: string;
    public readonly timeout: number;
    private readonly interceptors: Interceptor[] = [];
    public readonly adapter: RequestAdapterConstructor;
    constructor(options: RequestEndpointOptions) {
        this.baseURL = options.baseURL ?? document.baseURI;
        this.timeout = options.timeout ?? 0;

        if (options.interceptors) {
            const interceptors = options.interceptors.map(it => {
                if (typeof it === 'function') {
                    return {
                        invoke: it
                    };
                }
                return it;
            });
            this.interceptors.push(...interceptors);
        }
        this.adapter = options.adapter ?? XMLHttpRequestAdapter;
    }

    getInterceptors(): Interceptor[] {
        return this.interceptors;
    }
}
