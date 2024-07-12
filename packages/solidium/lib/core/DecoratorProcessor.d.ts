import { ApplicationContext, ClassMetadataReader, MemberKey, Newable } from '@vgerbot/ioc';
export declare const IS_MEMBER_DECORATOR_PROCESSOR: unique symbol;
export declare const IS_CLASS_DECORATOR_PROCESSOR: unique symbol;
export interface MemberDecoratorProcessor<T> {
    [IS_MEMBER_DECORATOR_PROCESSOR]: true;
    beforeInstantiation?: (constructor: Newable<T>, member: MemberKey, metadata: ClassMetadataReader<T>, container: ApplicationContext) => void;
    afterInstantiation?: (instance: T, member: MemberKey, metadata: ClassMetadataReader<T>, container: ApplicationContext) => void;
}
export interface ClassDecoratorProcessor<T> {
    [IS_CLASS_DECORATOR_PROCESSOR]: true;
    beforeInstantiation?: (constructor: Newable<T>, metadata: ClassMetadataReader<T>, container: ApplicationContext) => void;
    afterInstantiation?: (instance: T, metadata: ClassMetadataReader<T>, container: ApplicationContext) => T;
}
