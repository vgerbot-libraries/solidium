import { defineMemberDecoratorProcessor, getSignal } from '@vgerbot/solidium';
import { createEffect, on } from 'solid-js';
import { MemberKey } from '@vgerbot/ioc';
import { Storage } from '../core/Storage';
import { Data } from '../types/Data';

export interface StoreValueOptions {
    store: Storage;
    key?: string;
}

export const StorageValue = (options: StoreValueOptions) => {
    return defineMemberDecoratorProcessor('storage', {
        afterInstantiation<T extends Record<MemberKey, unknown>>(
            instance: T,
            member: MemberKey
        ) {
            const [, set] = getSignal(instance, member);
            const key = options.key || member.toString();
            const store = options.store;
            const observe = () => {
                return store.observe(key, newValue => {
                    set(newValue);
                });
            };
            let unobserve = observe();
            createEffect(
                on(
                    () => {
                        return instance[member];
                    },
                    newValue => {
                        unobserve();
                        store.setItem(key, newValue as Data).finally(() => {
                            unobserve = observe();
                        });
                    }
                )
            );
        }
    });
};
