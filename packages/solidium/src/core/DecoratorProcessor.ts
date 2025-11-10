import {
    ApplicationContext,
    ClassMetadataReader,
    MemberKey,
    Newable
} from '@vgerbot/ioc';

export const IS_MEMBER_DECORATOR_PROCESSOR = Symbol(
    'solidium-is-member-decorator-processor'
);
export const IS_CLASS_DECORATOR_PROCESSOR = Symbol(
    'solidium-is-class-decorator-processor'
);

export interface MemberDecoratorProcessor<T> {
    [IS_MEMBER_DECORATOR_PROCESSOR]: true;
    priority?: number;
    beforeInstantiation?: (
        constructor: Newable<T>,
        member: MemberKey,
        metadata: ClassMetadataReader<T>,
        container: ApplicationContext
    ) => void;
    afterInstantiation?: (
        instance: T,
        member: MemberKey,
        metadata: ClassMetadataReader<T>,
        container: ApplicationContext
    ) => void;
}

export interface ClassDecoratorProcessor<T> {
    [IS_CLASS_DECORATOR_PROCESSOR]: true;
    beforeInstantiation?: (
        constructor: Newable<T>,
        metadata: ClassMetadataReader<T>,
        container: ApplicationContext
    ) => void;
    afterInstantiation?: (
        instance: T,
        metadata: ClassMetadataReader<T>,
        container: ApplicationContext
    ) => T;
}
