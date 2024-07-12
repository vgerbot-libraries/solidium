import { ApplicationContext, Newable } from '@vgerbot/ioc';
export declare function beforeInstantiation<T>(constructor: Newable<T>, container: ApplicationContext): void;
export declare function afterInstantiation<T extends object>(instance: T, container: ApplicationContext): T;
