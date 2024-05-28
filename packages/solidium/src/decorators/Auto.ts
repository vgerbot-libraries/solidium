import { getOwner, runWithOwner } from 'solid-js';
import {
    defineSignalMember,
    isSignalMember
} from '../helper/defineSignalMember';
import { defineClassDecoratorProcessor } from '../core/defineClassDecoratorProcessor';

export const SOLIDIUM_MARK_CLASS_AUTO = Symbol('solidium-mark-class-auto');

export const Auto = defineClassDecoratorProcessor(SOLIDIUM_MARK_CLASS_AUTO, {
    afterInstantiation(instance: Record<string | symbol, unknown>) {
        if (!instance || typeof instance !== 'object') {
            return instance;
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
}) as ClassDecorator;
