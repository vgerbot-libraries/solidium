import {
    defineMemberDecoratorProcessor,
    defineSignalMember
} from '@vgerbot/solidium';
import { MemberKey } from '@vgerbot/ioc';
import { Storage } from '../core/Storage';
import { Data } from '../types/Data';

export interface StoreValueOptions {
    store: Storage;
    key?: string;
}

export const StorageValue = (options: StoreValueOptions) => {
    return defineMemberDecoratorProcessor('storage', {
        afterInstantiation<T>(instance: T, member: MemberKey) {
            const key = options.key || member.toString();
            const store = options.store;
            let isManual = true;
            const observe = () => {
                return store.observe(key, newValue => {
                    isManual = false;
                    try {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        instance[member] = newValue;
                    } finally {
                        isManual = true;
                    }
                });
            };
            let unobserve = observe();
            defineSignalMember<T>(instance, member, undefined, {
                setter(_oldValue, newValue) {
                    if (isManual) {
                        unobserve();
                        store.setItem(key, newValue as Data).finally(() => {
                            unobserve = observe();
                        });
                    }
                    return newValue;
                }
            });
        }
    });
};
