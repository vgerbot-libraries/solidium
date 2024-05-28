import { IS_MEMBER_DECORATOR_PROCESSOR, MemberDecoratorProcessor } from './DecoratorProcessor';
export declare function defineMemberDecoratorProcessor<T>(key: string | symbol, processor: Omit<MemberDecoratorProcessor<T>, typeof IS_MEMBER_DECORATOR_PROCESSOR>): PropertyDecorator;
