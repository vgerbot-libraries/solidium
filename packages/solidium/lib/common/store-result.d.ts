import { MemberKey } from '@vgerbot/ioc';
export declare function store(instance: Object, methodName: MemberKey, value: unknown): void;
export declare function clean(instance: Object, methodName: MemberKey): void;
type MethodKeys<T> = {
    [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];
type MethodReturnType<T, K extends MethodKeys<T>> = T[K] extends (...args: unknown[]) => unknown ? ReturnType<T[K]> : never;
export declare function resultOf<T>(instance: T, methodName: MethodKeys<T>): MethodReturnType<T, typeof methodName>;
export {};
