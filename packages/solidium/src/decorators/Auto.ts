import { defineSignalMember, isSignalMember } from '../helper/signal-member';
import { defineClassDecoratorProcessor } from '../core/defineClassDecoratorProcessor';
import { runWithSolidiumOwner } from '../core/owner';

export const SOLIDIUM_MARK_CLASS_AUTO = Symbol('solidium-mark-class-auto');

export const Auto = defineClassDecoratorProcessor(SOLIDIUM_MARK_CLASS_AUTO, {
    afterInstantiation(instance: Record<string | symbol, unknown>) {
        if (!instance || typeof instance !== 'object') {
            return instance;
        }
        const prototype = Object.getPrototypeOf(instance);

        return new Proxy(instance, {
            get(target, p, receiver) {
                if (typeof prototype[p] === 'function') {
                    return Reflect.get(target, p, receiver);
                }
                if (isSignalMember(prototype, p)) {
                    delete target[p];
                    return Reflect.get(target, p, receiver);
                }
                runWithSolidiumOwner(target, () => {
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
