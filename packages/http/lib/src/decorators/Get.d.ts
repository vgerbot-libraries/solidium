import { RequestOptions } from './Request';
export type GetRequestOptions = Omit<RequestOptions, 'method'>;
export declare function Get(options: string | GetRequestOptions): (target: import("../core/EndpointInstance").EndpointInstance, context: ClassMethodDecoratorContext | string | symbol) => ((this: import("../core/EndpointInstance").EndpointInstance, ...args: unknown[]) => any) | undefined;
