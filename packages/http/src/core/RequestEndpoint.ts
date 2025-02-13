import { Interceptor, InterceptorFunction } from './Interceptor';

interface RequestEndpointOptions {
    baseURL: string;
    timeout?: number;
    interceptors?: Array<Interceptor | InterceptorFunction>;
}

export class RequestEndpoint {
    public readonly baseURL: string;
    public readonly timeout: number;
    private readonly interceptors: Interceptor[] = [];
    constructor(
        options: RequestEndpointOptions,
        public parent?: RequestEndpoint
    ) {
        this.baseURL = options.baseURL ?? parent?.baseURL ?? document.baseURI;
        this.timeout = options.timeout ?? parent?.timeout ?? 0;
        
        if(options.interceptors) {
            const interceptors = options.interceptors.map(it => {
                if(typeof it === 'function') {
                    return {
                        invoke: it
                    }
                }
                return it;
            });
            this.interceptors.push(...interceptors);
        }
    }
    
    getInterceptors(): Interceptor[] {
        const parentInterceptors = this.parent?.getInterceptors() ?? [];
        return parentInterceptors.concat(this.interceptors);
    }
}
