import * as solid_js from 'solid-js';
import { ParentProps, Signal as Signal$1 } from 'solid-js';
import { ApplicationContext, Newable, MemberKey, ClassMetadata } from '@vgerbot/ioc';
import * as packages_ioc_dist_src from 'packages/ioc/dist/src';

type SolidiumProps = ParentProps<{
    init?: (appCtx: ApplicationContext) => void;
    autoRegisterClasses?: Array<Newable<unknown>>;
}>;
declare function Solidium(props: SolidiumProps): solid_js.JSX.Element;

/**
 * Options for the Signal decorator.
 * @experimental
 */
type SignalOptions = object;
/**
 * Decorator that turns a class property into a reactive signal.
 *
 * When applied to a property, it replaces the property with a getter and a setter.
 * The first time the property is accessed, a SolidJS signal is created with the property's initial value.
 * Subsequent accesses will return the current value of the signal.
 * When the property is assigned a new value, the signal is updated.
 *
 * This allows other parts of the application, such as components or other reactive code,
 * to subscribe to changes in the property's value.
 *
 * Example usage:
 * ```typescript
 * class MyStore {
 *   @Signal()
 *   count = 0;
 * }
 *
 * const store = new MyStore();
 *
 * createEffect(() => {
 *   console.log('Count changed:', store.count);
 * });
 *
 * store.count = 1; // This will trigger the effect and log the new value.
 * ```
 */
declare function Signal(_?: SignalOptions): <T>(target: Object, propertyKey: string | symbol) => void;

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
type ObserveOptions<T> = object | DependencyObserverOptions<T> | ScheduledObserverOptions;
declare function Observe<T>(options: DependencyObserverOptions<T>): MethodDecorator;
declare function Observe(options: ScheduledObserverOptions): MethodDecorator;
declare function Observe(options?: object): MethodDecorator;

/**
 * A property decorator that transforms a class getter into a memoized,
 * lazily-evaluated computed property.
 *
 * The decorated getter will be converted into a `solid-js` memo under the hood,
 * but it will not be evaluated until it's accessed for the first time.
 * Once evaluated, its value is cached and will only be re-calculated when its
 * underlying reactive dependencies change.
 *
 * This decorator should only be applied to getter methods without a corresponding
 * setter.
 *
 * @example
 * ```ts
 * class MyStore {
 *   @Signal
 *   firstName = 'John';
 *
 *   @Signal
 *   lastName = 'Doe';
 *
 *   @Computed
 *   get fullName() {
 *     console.log('Computing fullName...');
 *     return `${this.firstName} ${this.lastName}`;
 *   }
 * }
 *
 * const store = useService(MyStore);
 * // At this point, 'Computing fullName...' has not been logged.
 *
 * console.log(store.fullName); // Logs 'Computing fullName...' and then 'John Doe'
 * console.log(store.fullName); // Logs 'John Doe' directly from cache.
 *
 * store.firstName = 'Jane';
 * // The value is now stale, but re-computation is deferred.
 *
 * console.log(store.fullName); // Logs 'Computing fullName...' and then 'Jane Doe'
 * ```
 */
declare const Computed: PropertyDecorator;

declare const Batch: MethodDecorator;

declare function Track<T>(fn: (this: T) => unknown): MethodDecorator;

declare const Auto: ClassDecorator;

declare const Store: () => ClassDecorator;

type SetterInterceptorFunction<T> = (this: T, oldValue: unknown, newValue: unknown) => unknown;

declare const SETTER_INTERCEPTOR_MAP_KEY: unique symbol;
interface SetterInterceptorTarget<T> {
    [SETTER_INTERCEPTOR_MAP_KEY]: Map<MemberKey, SetterInterceptorFunction<T>> | undefined;
}
type SetterInterceptorOptions = {
    key: string | symbol;
};
declare function appendSetterInterceptor<T>(target: SetterInterceptorTarget<T>, options: SetterInterceptorOptions, interceptorMethodName: MemberKey): void;

declare const SetterInterceptor: (options: string | symbol | SetterInterceptorOptions) => MethodDecorator;

type MethodKeys<T> = {
    [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];
type MethodReturnType<T, K extends MethodKeys<T>> = T[K] extends (...args: unknown[]) => unknown ? ReturnType<T[K]> : never;
declare function resultOf<T>(instance: T, methodName: MethodKeys<T>): MethodReturnType<T, typeof methodName>;

declare const NOT_CHANGED_SYMBOL: unique symbol;
/**
 * Creates a new memoized computation that is lazily evaluated.
 *
 * Unlike `createMemo` from `solid-js`, the computation function `fn` is not
 * executed until the returned getter is accessed for the first time. After the
 * initial access, it behaves like a standard memo, re-computing its value
 * only when its dependencies change.
 *
 * @param fn The computation function to be memoized. It should not take any
 *   arguments and should return a value of type T.
 * @returns A getter function that returns the memoized value. Accessing this
 *   getter tracks the computation in the current reactive context.
 *
 * @example
 * ```ts
 * const [count, setCount] = createSignal(0);
 * const doubleCount = useComputed(() => {
 *   console.log('Computing doubleCount...');
 *   return count() * 2;
 * });
 *
 * // At this point, 'Computing doubleCount...' has not been logged yet.
 *
 * console.log(doubleCount()); // Logs 'Computing doubleCount...' and then 0
 * console.log(doubleCount()); // Logs 0, no re-computation
 *
 * setCount(5);
 * console.log(doubleCount()); // Logs 'Computing doubleCount...' and then 10
 * ```
 */
declare function useComputed<T>(fn: () => T): () => typeof NOT_CHANGED_SYMBOL | T;

declare function useApplicationContext(): packages_ioc_dist_src.ApplicationContext;

declare function useService<T>(cls: Newable<T>): T;

declare const IS_MEMBER_DECORATOR_PROCESSOR: unique symbol;
declare const IS_CLASS_DECORATOR_PROCESSOR: unique symbol;
interface MemberDecoratorProcessor<T> {
    [IS_MEMBER_DECORATOR_PROCESSOR]: true;
    priority?: number;
    beforeInstantiation?: (constructor: Newable<T>, member: MemberKey, metadata: ClassMetadata<T>, container: ApplicationContext) => void;
    afterInstantiation?: (instance: T, member: MemberKey, metadata: ClassMetadata<T>, container: ApplicationContext) => void;
}
interface ClassDecoratorProcessor<T> {
    [IS_CLASS_DECORATOR_PROCESSOR]: true;
    beforeInstantiation?: (constructor: Newable<T>, metadata: ClassMetadata<T>, container: ApplicationContext) => void;
    afterInstantiation?: (instance: T, metadata: ClassMetadata<T>, container: ApplicationContext) => T;
}

declare function defineClassDecoratorProcessor<T>(key: string | symbol, processor: Omit<ClassDecoratorProcessor<T>, typeof IS_CLASS_DECORATOR_PROCESSOR>): ClassDecorator;

declare function defineMemberDecoratorProcessor<T>(key: string | symbol, processor: Omit<MemberDecoratorProcessor<T>, typeof IS_MEMBER_DECORATOR_PROCESSOR>): PropertyDecorator;

declare function defineSignalMember<T>(target: T, member: MemberKey, defaultValue?: unknown, interceptors?: {
    getter?: (this: T, value: unknown) => unknown;
    setter?: (this: T, oldValue?: unknown, newValue?: unknown) => unknown;
}): void;
declare function isSignalMember<T>(target: T, member: MemberKey): boolean;
declare function getSignal<T>(instance: T, member: MemberKey, initializeValue?: unknown): Signal$1<unknown>;
declare function hasSignal<T>(instance: T, member: MemberKey): boolean;

declare class Tracker {
    track(callback: (dispose: () => void) => void): () => void;
    until(contition: () => boolean): Promise<void>;
}

declare function runWithSolidiumOwner<T>(instance: object, callback: () => T): T;

export { Auto, Batch, type ClassDecoratorProcessor, Computed, IS_CLASS_DECORATOR_PROCESSOR, IS_MEMBER_DECORATOR_PROCESSOR, type MemberDecoratorProcessor, Observe, type ObserveOptions, SETTER_INTERCEPTOR_MAP_KEY, SetterInterceptor, type SetterInterceptorOptions, type SetterInterceptorTarget, Signal, Solidium, Store, Track, Tracker, appendSetterInterceptor, defineClassDecoratorProcessor, defineMemberDecoratorProcessor, defineSignalMember, getSignal, hasSignal, isSignalMember, resultOf, runWithSolidiumOwner, useApplicationContext, useComputed, useService };
