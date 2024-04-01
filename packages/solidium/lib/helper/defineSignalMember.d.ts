import { MemberKey } from '@vgerbot/ioc';
export declare function defineSignalMember<T>(target: T, member: MemberKey, defaultValue?: unknown): void;
export declare function isSignalMember<T>(target: T, member: MemberKey): boolean;
