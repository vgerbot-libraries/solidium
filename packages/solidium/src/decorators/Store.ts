import { createStore } from 'solid-js/store';
import { defineClassDecoratorProcessor } from '../core/defineClassDecoratorProcessor';

export const SOLIDIUM_MARK_CLASS_STORE = Symbol('solidium-mark-class-store');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proxyCache = new WeakMap<object, any>();

type SetterFunction = {
    (key: string | symbol, value: unknown): void;
    (
        ...args: [
            ...paths: Array<string | symbol>,
            key: string | symbol,
            value: unknown
        ]
    ): void;
};

export const Store = () => {
    return defineClassDecoratorProcessor(SOLIDIUM_MARK_CLASS_STORE, {
        afterInstantiation(instance) {
            if (!instance || typeof instance !== 'object') {
                return instance;
            }
            const [object, set] = createStore(instance as object);

            const createProxyForNestedObject = (
                obj: object,
                path: (string | symbol)[] = [],
                setter: SetterFunction = set as unknown as SetterFunction
            ): object => {
                if (proxyCache.has(obj)) {
                    return proxyCache.get(obj);
                }

                const proxy = new Proxy(obj, {
                    get(target, p, receiver) {
                        const value = Reflect.get(target, p, receiver);
                        if (!!value && typeof value === 'object') {
                            return createProxyForNestedObject(
                                value,
                                [...path, p],
                                setter
                            );
                        }
                        return value;
                    },
                    set(target, p, newValue) {
                        if (path.length === 0) {
                            setter(p, newValue);
                        } else {
                            setter(...path, p, newValue);
                        }
                        return true;
                    }
                });

                proxyCache.set(obj, proxy);
                return proxy;
            };

            return createProxyForNestedObject(object);
        }
    }) as ClassDecorator;
};
