export declare const OBSERVE_PROPERTY_MARK_KEY: unique symbol;
type DependencyObserverOptions<T> = {
    deps: Array<(this: T) => unknown>;
    defer?: boolean;
};
type ScheduledObserverOptions = {
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
export type ObserveOptions<T> = {} | DependencyObserverOptions<T> | ScheduledObserverOptions;
export declare function Observe<T>(options: DependencyObserverOptions<T>): MethodDecorator;
export declare function Observe(options: ScheduledObserverOptions): MethodDecorator;
export declare function Observe(options?: {}): MethodDecorator;
export {};
