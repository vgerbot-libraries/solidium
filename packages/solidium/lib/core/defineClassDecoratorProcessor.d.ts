import { ClassDecoratorProcessor, IS_CLASS_DECORATOR_PROCESSOR } from './DecoratorProcessor';
export declare function defineClassDecoratorProcessor<T>(key: string | symbol, processor: Omit<ClassDecoratorProcessor<T>, typeof IS_CLASS_DECORATOR_PROCESSOR>): ClassDecorator;
