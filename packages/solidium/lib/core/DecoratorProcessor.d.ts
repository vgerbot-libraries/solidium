import { ClassMetadataReader, MemberKey, Newable } from '@vgerbot/ioc';
export declare const IS_MEMBER_DECORATOR_PROCESSOR: unique symbol;
export declare const IS_CLASS_DECORATOR_PROCESSOR: unique symbol;
export interface MemberDecoratorProcessor {
    [IS_MEMBER_DECORATOR_PROCESSOR]: true;
    beforeInstantiation?: <T>(constructor: Newable<T>, member: MemberKey, metadata: ClassMetadataReader<T>) => void;
    afterInstantiation?: <T>(instance: T, member: MemberKey, metadata: ClassMetadataReader<T>) => void;
}
export interface ClassDecoratorProcessor {
    [IS_CLASS_DECORATOR_PROCESSOR]: true;
    beforeInstantiation?: <T>(constructor: Newable<T>, metadata: ClassMetadataReader<T>) => void;
    afterInstantiation?: <T>(instance: T, metadata: ClassMetadataReader<T>) => T;
}
