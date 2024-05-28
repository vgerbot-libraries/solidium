import { createStore } from 'solid-js/store';
import { defineClassDecoratorProcessor } from '../core/defineClassDecoratorProcessor';

export const SOLIDIUM_MARK_CLASS_STORE = Symbol('solidium-mark-class-store');

export const Store = () => {
    return defineClassDecoratorProcessor(SOLIDIUM_MARK_CLASS_STORE, {
        afterInstantiation(instance) {
            if (!instance || typeof instance !== 'object') {
                return instance;
            }
            return createStore(instance);
        }
    }) as ClassDecorator;
};
