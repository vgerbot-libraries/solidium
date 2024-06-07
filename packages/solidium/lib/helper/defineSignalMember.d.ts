import { MemberKey } from '@vgerbot/ioc';
export declare function defineSignalMember<T>(target: T, member: MemberKey, defaultValue?: unknown, interceptors?: {
    getter?: (this: T, value: unknown) => unknown;
    setter?: (this: T, oldValue?: unknown, newValue?: unknown) => unknown;
}): void;
export declare function isSignalMember<T>(target: T, member: MemberKey): boolean;
