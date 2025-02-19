import { AdapterOptions } from '../adapter/AdapterOptions';
import { XMLHttpRequestAdapter } from '../adapter/XMLHTTPRequestAdapter';
import { isURL } from '../common/isURL';
import { joinPath } from '../common/joinPath';
import { mergeAbortSignal } from '../common/mergeAbortSignal';
import { resolveURL } from '../common/resolveURL';
import { EndpointMetadata } from '../metadata/EndpointMetadata';
import { RequestMethodMetadata } from '../metadata/RequestMethodMetadata';
import {
    CONSTRUCT_INTERCEPTORS,
    ADAPTER,
    INTERCEPTORS,
    EndpointInstance
} from './EndpointInstance';
import { ExecuteRequestMethodParams } from './ExecuteRequestParams';
import { HttpResponse } from './HttpResponse';

export class RequestMethod {
    private readonly url: string;
    constructor(
        public readonly name: string | symbol,
        public readonly endpointMetadata: EndpointMetadata,
        private readonly metadata: RequestMethodMetadata
    ) {
        const pathOrURL = metadata.getPath();
        if (isURL(pathOrURL)) {
            this.url = pathOrURL;
        } else {
            this.url = joinPath(this.endpointMetadata.getBaseURL(), pathOrURL);
        }
    }

    invoke(instance: EndpointInstance, params: ExecuteRequestMethodParams) {
        const interceptors = instance[INTERCEPTORS];
        const methodInterceptors = instance[CONSTRUCT_INTERCEPTORS](
            this.metadata.getInterceptors()
        );
        const allInterceptors = interceptors.concat(methodInterceptors);
        const sendRequest = allInterceptors.reduceRight(
            (next, interceptor) =>
                (method: RequestMethod, params: ExecuteRequestMethodParams) => {
                    return interceptor.invoke(method, params, next);
                },
            async (
                method: RequestMethod,
                params: ExecuteRequestMethodParams
            ): Promise<HttpResponse> => {
                const adapter = method.createAdapter(instance, params);
                const source = await adapter.execute();
                return new HttpResponse(source, {
                    status: source.status,
                    method: this
                });
            }
        );
        return sendRequest(this, params);
    }
    private createAdapter(
        instance: EndpointInstance,
        params: ExecuteRequestMethodParams
    ) {
        const url = resolveURL(
            this.url,
            params.pathVariables ?? {},
            params.queryParams ?? {}
        );
        const method = this.metadata.getHttpMethod();
        const headers = this.metadata.getHeaders();
        const timeout =
            this.metadata.getTimeout() || this.endpointMetadata.getTimeout();
        const signal = mergeAbortSignal(
            this.metadata.getSignal(),
            params.signal
        );
        const options: AdapterOptions = {
            url,
            method,
            headers: headers.concat(params.headers),
            payload: params.payload,
            signal,
            timeout,
            invokeMethod: this
        };
        const adapter = new (params.adapter ??
            this.metadata.getAdapter() ??
            instance[ADAPTER] ??
            XMLHttpRequestAdapter)(options);
        return adapter;
    }
}
