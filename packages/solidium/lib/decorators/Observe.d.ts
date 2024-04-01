import { AccessorArray } from 'solid-js';
export declare const OBSERVE_PROPERTY_MARK_KEY: unique symbol;
export type ObserveOptions = {} | {
    deps: AccessorArray<unknown>;
    defer?: boolean;
} | {
    schedule: {
        mode: 'throttle';
        trailing?: boolean;
        leading?: boolean;
        wait?: number;
    } | {
        mode: 'debounce';
        trailing?: boolean;
        leading?: boolean;
        wait?: number;
        maxWait?: number;
    };
};
/**
 *
 * @param options optional
 * @returns an method decorator
 */
export declare const Observe: (options?: ObserveOptions) => MethodDecorator;
