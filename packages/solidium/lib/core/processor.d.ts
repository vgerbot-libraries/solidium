import { Newable } from '@vgerbot/ioc';
export declare function beforeInstantiation<T>(constructor: Newable<T>): void;
export declare function afterInstantiation<T extends object>(instance: T): T;
