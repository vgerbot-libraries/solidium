import { Owner } from 'solid-js';
export declare function runWithSolidiumOwner<T>(instance: object, callback: () => T): T | undefined;
export declare function setupOwner(instance: object, owner: Owner): void;
