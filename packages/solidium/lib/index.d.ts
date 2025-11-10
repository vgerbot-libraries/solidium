import * as solid_js from 'solid-js';
import { ParentProps, Signal as Signal$1 } from 'solid-js';
import { ApplicationContext, Newable, MemberKey, ClassMetadataReader } from '@vgerbot/ioc';
import * as packages_ioc_dist_src from 'packages/ioc/dist/src';

type SolidiumProps = ParentProps<{
    init?: (appCtx: ApplicationContext) => void;
    autoRegisterClasses?: Array<Newable<unknown>>;
}>;
declare function Solidium(props: SolidiumProps): solid_js.JSX.Element;

interface SignalOptions {
}
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
type ObserveOptions<T> = {} | DependencyObserverOptions<T> | ScheduledObserverOptions;
declare function Observe<T>(options: DependencyObserverOptions<T>): MethodDecorator;
declare function Observe(options: ScheduledObserverOptions): MethodDecorator;
declare function Observe(options?: {}): MethodDecorator;

declare const Computed: PropertyDecorator;

declare const Batch: MethodDecorator;

declare function Track<T>(fn: (this: T) => unknown): MethodDecorator;

declare const Auto: ClassDecorator;

type MethodKeys<T> = {
    [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];
type MethodReturnType<T, K extends MethodKeys<T>> = T[K] extends (...args: unknown[]) => unknown ? ReturnType<T[K]> : never;
declare function resultOf<T>(instance: T, methodName: MethodKeys<T>): MethodReturnType<T, typeof methodName>;

declare const NOT_CHANGED_SYMBOL: unique symbol;
declare function useComputed<T>(fn: () => T): () => typeof NOT_CHANGED_SYMBOL | T;

declare function useApplicationContext(): packages_ioc_dist_src.ApplicationContext;

declare function useService<T>(cls: Newable<T>): T;

declare const IS_MEMBER_DECORATOR_PROCESSOR: unique symbol;
declare const IS_CLASS_DECORATOR_PROCESSOR: unique symbol;
interface MemberDecoratorProcessor<T> {
    [IS_MEMBER_DECORATOR_PROCESSOR]: true;
    priority?: number;
    beforeInstantiation?: (constructor: Newable<T>, member: MemberKey, metadata: ClassMetadataReader<T>, container: ApplicationContext) => void;
    afterInstantiation?: (instance: T, member: MemberKey, metadata: ClassMetadataReader<T>, container: ApplicationContext) => void;
}
interface ClassDecoratorProcessor<T> {
    [IS_CLASS_DECORATOR_PROCESSOR]: true;
    beforeInstantiation?: (constructor: Newable<T>, metadata: ClassMetadataReader<T>, container: ApplicationContext) => void;
    afterInstantiation?: (instance: T, metadata: ClassMetadataReader<T>, container: ApplicationContext) => T;
}

declare function defineClassDecoratorProcessor<T>(key: string | symbol, processor: Omit<ClassDecoratorProcessor<T>, typeof IS_CLASS_DECORATOR_PROCESSOR>): ClassDecorator;

declare function defineMemberDecoratorProcessor<T>(key: string | symbol, processor: Omit<MemberDecoratorProcessor<T>, typeof IS_MEMBER_DECORATOR_PROCESSOR>): PropertyDecorator;

type SetterInterceptorFunction<T> = (this: T, oldValue: unknown, newValue: unknown) => unknown;

declare const SETTER_INTERCEPTOR_MAP_KEY: unique symbol;
interface SetterInterceptorTarget<T> {
    [SETTER_INTERCEPTOR_MAP_KEY]: Map<MemberKey, SetterInterceptorFunction<T>> | undefined;
}
type SetterInterceptorOptions = {
    key: string | symbol;
};
declare function appendSetterInterceptor<T>(target: SetterInterceptorTarget<T>, options: SetterInterceptorOptions, interceptorMethodName: MemberKey): void;

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

export { Auto, Batch, type ClassDecoratorProcessor, Computed, IS_CLASS_DECORATOR_PROCESSOR, IS_MEMBER_DECORATOR_PROCESSOR, type MemberDecoratorProcessor, Observe, type ObserveOptions, SETTER_INTERCEPTOR_MAP_KEY, type SetterInterceptorOptions, type SetterInterceptorTarget, Signal, Solidium, Track, Tracker, appendSetterInterceptor, defineClassDecoratorProcessor, defineMemberDecoratorProcessor, defineSignalMember, getSignal, hasSignal, isSignalMember, resultOf, runWithSolidiumOwner, useApplicationContext, useComputed, useService };
