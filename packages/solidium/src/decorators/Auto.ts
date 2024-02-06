import { Mark } from '@vgerbot/ioc';
import {
    ClassDecoratorProcessor,
    IS_CLASS_DECORATOR_PROCESSOR
} from '../core/DecoratorProcessor';
import { getOwner, runWithOwner } from 'solid-js';
import {
    defineSignalMember,
    isSignalMember
} from '../helper/defineSignalMember';

export const SOLIDIUM_MARK_CLASS_AUTO = Symbol('solidium-mark-class-auto');

export const Auto = Mark(SOLIDIUM_MARK_CLASS_AUTO, {
    [IS_CLASS_DECORATOR_PROCESSOR]: true,
    afterInstantiation(instance: Record<string | symbol, unknown>) {
        if (!instance || typeof instance !== 'object') {
            return;
        }
        const prototype = Object.getPrototypeOf(instance);
        const owner = getOwner();
        return new Proxy(instance, {
            get(target, p, receiver) {
                if (typeof prototype[p] === 'function') {
                    return Reflect.get(target, p, receiver);
                }
                if (isSignalMember(prototype, p)) {
                    delete target[p];
                    return Reflect.get(target, p, receiver);
                }
                runWithOwner(owner, () => {
                    defineSignalMember(prototype, p, target[p]);
                    delete target[p];
                });
                return Reflect.get(target, p, receiver);
            },
            set(target, p, newValue, receiver) {
                return Reflect.set(target, p, newValue, receiver);
            }
        });
    }
} as ClassDecoratorProcessor) as ClassDecorator;
