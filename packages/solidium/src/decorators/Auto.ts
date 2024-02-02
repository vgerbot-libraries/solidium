import { Mark } from '@vgerbot/ioc';
import {
    ClassDecoratorProcessor,
    IS_CLASS_DECORATOR_PROCESSOR
} from '../core/DecoratorProcessor';

export const SOLIDIUM_MARK_CLASS_AUTO = Symbol('solidium-mark-class-auto');

export const Auto = Mark(SOLIDIUM_MARK_CLASS_AUTO, {
    [IS_CLASS_DECORATOR_PROCESSOR]: true,
    beforeInstantiation(constructor, metadata) {
        console.log(metadata.getPropertyTypeMap());
    }
} as ClassDecoratorProcessor) as ClassDecorator;
