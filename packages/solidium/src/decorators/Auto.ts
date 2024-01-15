import { Mark } from '@vgerbot/ioc';
import {
    ClassDecoratorHandler,
    IS_CLASS_DECORATOR_HANDLER
} from '../core/DecoratorHandler';

export const STORE_CLASS_MARK_KEY = Symbol('solidium-store-class');

export const Auto = Mark(STORE_CLASS_MARK_KEY, {
    [IS_CLASS_DECORATOR_HANDLER]: true,
    beforeInstantiation(constructor, metadata) {
        console.log(metadata.getPropertyTypeMap());
    }
} as ClassDecoratorHandler) as ClassDecorator;
