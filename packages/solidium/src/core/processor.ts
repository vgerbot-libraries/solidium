import { ClassMetadata, MemberKey, Newable } from '@vgerbot/ioc';
import {
    MemberDecoratorProcessor,
    IS_MEMBER_DECORATOR_PROCESSOR,
    IS_CLASS_DECORATOR_PROCESSOR,
    ClassDecoratorProcessor
} from './DecoratorProcessor';

const SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY = Symbol(
    'solidium-member-decorator-processors'
);
const SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY = Symbol(
    'solidium-class-decorator-processors'
);

type ConstructorWithDecoratorProcessor<T> = Newable<T> & {
    [SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY]?: Set<ClassDecoratorProcessor<T>>;
    [SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY]?: AllProcessorsMap;
};

type AllProcessorsMap = Map<MemberKey, Set<MemberDecoratorProcessor<unknown>>>;

function initClassDecoratorProcessorsSet<T>(constructor: Newable<T>) {
    if (constructor.hasOwnProperty(SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY)) {
        return;
    }
    const metadata = ClassMetadata.getInstance(constructor).reader();
    const classMarkInfo = metadata.getCtorMarkInfo();
    const allClassDecoratorProcessor = new Set<ClassDecoratorProcessor<T>>();
    if (classMarkInfo) {
        const classMarkInfoMembers = [
            ...Object.getOwnPropertyNames(classMarkInfo),
            ...Object.getOwnPropertySymbols(classMarkInfo)
        ];
        classMarkInfoMembers.forEach(markInfoKey => {
            const processor = classMarkInfo[
                markInfoKey
            ] as ClassDecoratorProcessor<T>;
            if (
                typeof processor !== 'object' ||
                !processor[IS_CLASS_DECORATOR_PROCESSOR]
            ) {
                return;
            }
            allClassDecoratorProcessor.add(processor);
        });
    }
    if (allClassDecoratorProcessor.size === 0) {
        return;
    }
    Object.defineProperty(constructor, SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: allClassDecoratorProcessor
    });
    allClassDecoratorProcessor.forEach(processor => {
        processor.beforeInstantiation &&
            processor.beforeInstantiation(constructor, metadata);
    });
}

function initMemberDecoratorProcessorsSet<T>(constructor: Newable<T>) {
    if (constructor.hasOwnProperty(SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY)) {
        return;
    }
    const metadata = ClassMetadata.getInstance(constructor).reader();

    const instanceMembers = metadata.getAllMarkedMembers();
    const allMemberDecoratorProcessors = new Map<
        MemberKey,
        Set<MemberDecoratorProcessor<unknown>>
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
                | MemberDecoratorProcessor<unknown>
                | undefined;
            if (
                markData == null ||
                markData == undefined ||
                typeof markData !== 'object' ||
                !markData[IS_MEMBER_DECORATOR_PROCESSOR]
            ) {
                return;
            }
            const processors =
                allMemberDecoratorProcessors.get(member) || new Set();
            allMemberDecoratorProcessors.set(member, processors);
            processors.add(markData);
        });
    });
    if (allMemberDecoratorProcessors.size === 0) {
        return;
    }
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
                processor.beforeInstantiation(constructor, member, metadata);
            }
        });
    });
}

export function beforeInstantiation<T>(constructor: Newable<T>) {
    initClassDecoratorProcessorsSet(constructor);
    initMemberDecoratorProcessorsSet(constructor);
}

export function afterInstantiation<T extends object>(instance: T): T {
    const constructor =
        instance.constructor as ConstructorWithDecoratorProcessor<T>;
    const metadata = ClassMetadata.getInstance(constructor).reader();
    const allClassProcessors =
        constructor[SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY];

    if (!!allClassProcessors) {
        allClassProcessors.forEach(processor => {
            const newInstance =
                processor.afterInstantiation &&
                processor.afterInstantiation(instance, metadata);
            if (newInstance instanceof constructor) {
                instance = newInstance;
            }
        });
    }
    const allMemberProcessors =
        constructor[SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY];
    if (!!allMemberProcessors) {
        allMemberProcessors.forEach((processors, member) => {
            processors.forEach(processor => {
                if (processor.afterInstantiation) {
                    processor.afterInstantiation(instance, member, metadata);
                }
            });
        });
    }
    return instance;
}
