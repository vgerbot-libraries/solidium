import { ClassMetadata, MemberKey, Newable } from '@vgerbot/ioc';
import {
    MemberDecoratorProcessor,
    IS_MEMBER_DECORATOR_POROCESSOR,
    IS_CLASS_DECORATOR_PROCESSOR,
    ClassDecoratorProcessor
} from './DecoratorProcessor';

const SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY = Symbol(
    'solidium-member-decorator-processors'
);
const SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY = Symbol(
    'solidium-class-decorator-processors'
);

type AllProcessorsMap = Map<MemberKey, Set<MemberDecoratorProcessor>>;

export function beforeInstantiation<T>(constructor: Newable<T>) {
    const metadata = ClassMetadata.getInstance(constructor).reader();
    const classMarkInfo = metadata.getCtorMarkInfo();
    const allClassDecoratorProcessor = new Set<ClassDecoratorProcessor>();
    if (classMarkInfo) {
        const classMarkInfoMembers = [
            ...Object.getOwnPropertyNames(classMarkInfo),
            ...Object.getOwnPropertySymbols(classMarkInfo)
        ];
        classMarkInfoMembers.forEach(markInfoKey => {
            const processor = classMarkInfo[
                markInfoKey
            ] as ClassDecoratorProcessor;
            if (
                typeof processor !== 'object' ||
                !processor[IS_CLASS_DECORATOR_PROCESSOR]
            ) {
                return;
            }
            allClassDecoratorProcessor.add(processor);
        });
    }
    const instanceMembers = metadata.getAllMarkedMembers();
    const allMemberDecoratorProcessors = new Map<
        MemberKey,
        Set<MemberDecoratorProcessor>
    >();
    instanceMembers.forEach(member => {
        const markInfo = metadata.getMembersMarkInfo(member);
        if (!markInfo) {
            return;
        }
        const markInfoMembers = [
            ...Object.getOwnPropertyNames(markInfo),
            ...Object.getOwnPropertySymbols(markInfo)
        ];
        markInfoMembers.forEach(key => {
            const markData = markInfo[key] as
                | MemberDecoratorProcessor
                | undefined;
            if (
                markData == null ||
                markData == undefined ||
                typeof markData !== 'object' ||
                !markData[IS_MEMBER_DECORATOR_POROCESSOR]
            ) {
                return;
            }
            const processors =
                allMemberDecoratorProcessors.get(member) || new Set();
            allMemberDecoratorProcessors.set(member, processors);
            processors.add(markData);
        });
    });
    if (allClassDecoratorProcessor.size > 0) {
        Object.defineProperty(
            constructor,
            SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY,
            {
                enumerable: false,
                configurable: false,
                writable: false,
                value: allClassDecoratorProcessor
            }
        );
        allClassDecoratorProcessor.forEach(processor => {
            processor.beforeInstantiation &&
                processor.beforeInstantiation(constructor, metadata);
        });
    }
    if (allMemberDecoratorProcessors.size > 0) {
        Object.defineProperty(
            constructor,
            SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY,
            {
                enumerable: false,
                configurable: false,
                writable: false,
                value: allMemberDecoratorProcessors
            }
        );
        allMemberDecoratorProcessors.forEach((processors, member) => {
            processors.forEach(processor => {
                if (processor.beforeInstantiation) {
                    processor.beforeInstantiation<T>(
                        constructor,
                        member,
                        metadata
                    );
                }
            });
        });
    }
}

export function afterInstantiation<T extends object>(instance: T): T {
    const constructor = instance.constructor as Newable<T>;
    const metadata = ClassMetadata.getInstance(constructor).reader();

    if (SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY in constructor) {
        const allMemberProcessors = constructor[
            SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY
        ] as AllProcessorsMap;

        allMemberProcessors.forEach((processors, member) => {
            processors.forEach(processor => {
                if (processor.afterInstantiation) {
                    processor.afterInstantiation(instance, member, metadata);
                }
            });
        });
    }
    if (SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY in constructor) {
        const allClassProcessors = constructor[
            SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY
        ] as Set<ClassDecoratorProcessor>;
        allClassProcessors.forEach(processor => {
            processor.afterInstantiation &&
                processor.afterInstantiation(instance, metadata);
        });
    }

    return instance;
}
