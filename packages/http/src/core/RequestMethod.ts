import { AdapterOptions } from '../adapter/AdapterOptions';
import { XMLHttpRequestAdapter } from '../adapter/XMLHTTPRequestAdapter';
import { isURL } from '../common/isURL';
import { joinPath } from '../common/joinPath';
import { resolveURL } from '../common/resolveURL';
import { ErrorContextInterceptor } from '../interceptors/ErrorContextInterceptor';
import { RetryInterceptor } from '../interceptors/RetryInterceptor';
import { TimeoutInterceptor } from '../interceptors/TimeoutInterceptor';
import { EndpointMetadata } from '../metadata/EndpointMetadata';
import { RequestMethodMetadata } from '../metadata/RequestMethodMetadata';
import {
    INTERCEPTORS,
    ADAPTER,
    CONSTRUCT_INTERCEPTORS,
    ABORT_CONTROLLER
} from './EndpointMembers';
import { type EndpointInstance } from './EndpointInstance';
import { ExecuteRequestMethodParams } from './ExecuteRequestParams';
import { HttpResponse } from './HttpResponse';
import { Interceptor } from './Interceptor';
import { mergeAbortSignal } from '../common/mergeAbortSignal';

export class RequestMethod {
    private readonly url: string;
    private readonly baseInterceptors: Interceptor[] = [];
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
        this.baseInterceptors.push(new ErrorContextInterceptor());
        const retryConfig = this.metadata.getRetryConfig();
        if (retryConfig) {
            this.baseInterceptors.push(new RetryInterceptor(retryConfig));
        }
    }

    invoke(instance: EndpointInstance, params: ExecuteRequestMethodParams) {
        const timeout =
            this.metadata.getTimeout() || this.endpointMetadata.getTimeout();
        const extInterceptors: Interceptor[] = [];
        if (timeout > 0) {
            extInterceptors.push(new TimeoutInterceptor({ timeout }));
        } else if (timeout !== 0) {
            extInterceptors.push(new TimeoutInterceptor());
        }
        const endpointInterceptors = instance[INTERCEPTORS];
        const methodInterceptors = instance[CONSTRUCT_INTERCEPTORS](
            this.metadata.getInterceptors()
        );
        const allInterceptors = [
            ...this.baseInterceptors,
            ...extInterceptors,
            ...endpointInterceptors,
            ...methodInterceptors
        ];

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
            params.queryParams
        );
        const method = this.metadata.getHttpMethod();
        const headers = this.metadata.getHeaders();
        const signal = mergeAbortSignal(
            instance[ABORT_CONTROLLER].signal,
            params.signal
        );
        const options: AdapterOptions = {
            url,
            method,
            headers: headers.concat(params.headers),
            payload: params.payload,
            signal,
            invokeMethod: this
        };
        const adapter = new (params.adapter ??
            this.metadata.getAdapter() ??
            instance[ADAPTER] ??
            XMLHttpRequestAdapter)(options);
        return adapter;
    }
}
