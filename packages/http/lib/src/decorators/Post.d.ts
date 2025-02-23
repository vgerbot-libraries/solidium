import { RequestOptions } from './Request';
export type PostRequestOptions = Omit<RequestOptions, 'method'>;
export declare function Post(options: string | PostRequestOptions): (target: import("../core/EndpointInstance").EndpointInstance, context: ClassMethodDecoratorContext | string | symbol) => ((this: import("../core/EndpointInstance").EndpointInstance, ...args: unknown[]) => any) | undefined;
