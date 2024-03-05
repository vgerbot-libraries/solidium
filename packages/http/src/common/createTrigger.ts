import { ApplicationContext, Newable } from '@vgerbot/ioc';
import { HttpRequestTriggerOptions } from '../types/HttpRequestTriggerOptions';
import {
    HttpRequestTrigger,
    isTriggerInstance
} from '../types/HttpRequestTrigger';
import { isObject } from './isObject';
import { SmartTrigger } from '../trigger/SmartTrigger';

export function createTrigger(
    appCtx: ApplicationContext,
    options?:
        | HttpRequestTriggerOptions
        | Newable<HttpRequestTrigger>
        | HttpRequestTrigger
): HttpRequestTrigger | undefined {
    if (isObject<HttpRequestTriggerOptions>(options)) {
        return new SmartTrigger(options);
    }
    if (typeof options === 'function') {
        return appCtx.getInstance(options);
    }
    if (isTriggerInstance(options)) {
        return options;
    }
}
