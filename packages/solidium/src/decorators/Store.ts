import { createStore } from 'solid-js/store';
import { Mark } from '@vgerbot/ioc';
import {
    ClassDecoratorProcessor,
    IS_CLASS_DECORATOR_PROCESSOR
} from '../core/DecoratorProcessor';

export const SOLIDIUM_MARK_CLASS_STORE = Symbol('solidium-mark-class-store');

export const Store = () => {
    return Mark(SOLIDIUM_MARK_CLASS_STORE, {
        [IS_CLASS_DECORATOR_PROCESSOR]: true,
        afterInstantiation(instance) {
            if (!instance || typeof instance !== 'object') {
                return instance;
            }
            return createStore(instance);
        }
    } as ClassDecoratorProcessor) as ClassDecorator;
};
