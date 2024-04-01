import { ApplicationContext, Newable } from '@vgerbot/ioc';
import { HttpRequestTriggerOptions } from '../types/HttpRequestTriggerOptions';
import { HttpRequestTrigger } from '../types/HttpRequestTrigger';
export declare function createTrigger(appCtx: ApplicationContext, options?: HttpRequestTriggerOptions | Newable<HttpRequestTrigger> | HttpRequestTrigger): HttpRequestTrigger | undefined;
