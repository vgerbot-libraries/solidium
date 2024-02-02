import { ClassMetadataReader, MemberKey, Newable } from '@vgerbot/ioc';

export const IS_MEMBER_DECORATOR_PROCESSOR = Symbol(
    'solidium-is-member-decorator-processor'
);
export const IS_CLASS_DECORATOR_PROCESSOR = Symbol(
    'solidium-is-class-decorator-processor'
);

export interface MemberDecoratorProcessor {
    [IS_MEMBER_DECORATOR_PROCESSOR]: true;
    beforeInstantiation?: <T>(
        constructor: Newable<T>,
        member: MemberKey,
        metadata: ClassMetadataReader<T>
    ) => void;
    afterInstantiation?: <T>(
        instance: T,
        member: MemberKey,
        metadata: ClassMetadataReader<T>
    ) => void;
}

export interface ClassDecoratorProcessor {
    [IS_CLASS_DECORATOR_PROCESSOR]: true;
    beforeInstantiation?: <T>(
        constructor: Newable<T>,
        metadata: ClassMetadataReader<T>
    ) => void;
    afterInstantiation?: <T>(
        instance: T,
        metadata: ClassMetadataReader<T>
    ) => T;
}
