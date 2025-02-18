import { AdapterOptions } from '../adapter/AdapterOptions';
import { RequestAdapterConstructor } from '../adapter/RequestAdapter';
import { isURL } from '../common/isURL';
import { joinPath } from '../common/joinPath';
import { resolveURL } from '../common/resolveURL';
import { HttpHeaders } from '../http/HttpHeaders';
import { HttpMethod } from '../http/HttpMethod';
import { ExecuteRequestMethodParams } from './ExecuteRequestParams';
import { HttpResponse } from './HttpResponse';
import { Interceptor } from './Interceptor';
import { RequestEndpoint } from './RequestEndpoint';

export class RequestMethod {
    private readonly url: string;
    private readonly interceptors: Interceptor[] = [];
    private readonly timeout: number;
    private readonly adapter: RequestAdapterConstructor;
    constructor(
        public readonly endpoint: RequestEndpoint,
        public readonly method: HttpMethod,
        private readonly headers: HttpHeaders,
        adapter: RequestAdapterConstructor | undefined,
        timeout: number,
        pathOrURL: string
    ) {
        if (isURL(pathOrURL)) {
            this.url = pathOrURL;
        } else {
            this.url = joinPath(this.endpoint.baseURL, pathOrURL);
        }
        this.adapter = adapter ?? endpoint.adapter;
        this.timeout = timeout || this.endpoint.timeout;
    }

    invoke(params: ExecuteRequestMethodParams) {
        const interceptors = this.endpoint.getInterceptors();
        const allInterceptors = interceptors.concat(this.interceptors);
        const sendRequest = allInterceptors.reduceRight(
            (next, interceptor) =>
                (method: RequestMethod, params: ExecuteRequestMethodParams) => {
                    return interceptor.invoke(method, params, next);
                },
            async (
                method: RequestMethod,
                params: ExecuteRequestMethodParams
            ): Promise<HttpResponse> => {
                const adapter = method.createAdapter(params);
                const source = await adapter.execute();
                return new HttpResponse(source, {
                    status: source.status,
                    method: this
                });
            }
        );
        return sendRequest(this, params);
    }
    private createAdapter(params: ExecuteRequestMethodParams) {
        const url = resolveURL(
            this.url,
            params.pathVariables ?? {},
            params.queryParams ?? {}
        );
        const options: AdapterOptions = {
            url,
            method: this.method,
            headers: this.headers.concat(params.headers),
            body: params.payload,
            singal: params.signal,
            timeout: this.timeout,
            invokeMethod: this
        };
        const adapter = new (params.adapter ??
            this.adapter ??
            this.endpoint.adapter)(options);
        return adapter;
    }
}
