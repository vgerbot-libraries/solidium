import { EndpointInstance } from '../core/EndpointInstance';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { Interceptor } from '../core/Interceptor';
import { RequestOptions } from '../decorators/Request';
import { HttpHeaders } from '../http/HttpHeaders';
import { SWRConfig } from '../swr/SWRConfig';
export type ExecutionHandler = (instance: EndpointInstance, metadata: RequestMethodMetadata, params: ExecuteRequestMethodParams, args: unknown[]) => void;
export declare class RequestMethodMetadata {
    readonly name: string | symbol;
    private readonly options;
    private readonly executionHandlers;
    private signal;
    private swrConfig?;
    constructor(name: string | symbol, options: RequestOptions);
    appendSWRConfig(config: SWRConfig): void;
    getSWRConfig(): SWRConfig | undefined;
    getRetryConfig(): import("..").RetryConfig | undefined;
    appendExecutionHandler(handler: ExecutionHandler): void;
    getExecutionHandlers(): ExecutionHandler[];
    appendSignal(signal: AbortSignal): void;
    getSignal(): AbortSignal;
    getPath(): string;
    getHttpMethod(): import("..").HttpMethod;
    getHeaders(): HttpHeaders;
    getTimeout(): number;
    getInterceptors(): (import("../core/Interceptor").InterceptorTypeIdentifier | Interceptor)[];
    getAdapter(): import("..").RequestAdapterConstructor | undefined;
}
