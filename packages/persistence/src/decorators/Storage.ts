import { defineMemberDecoratorProcessor, getSignal } from '@vgerbot/solidium';
import { createEffect, on } from 'solid-js';
import {
    ApplicationContext,
    ClassMetadataReader,
    MemberKey
} from '@vgerbot/ioc';
import { Data } from '../types/Data';
import { Bucket } from '../core/bucket/Bucket';
import { DEFAULT_BUCKET } from '../core/constants';

export interface StorageOptions {
    bucket?: string | symbol | Bucket;
    key?: string;
}

export const Storage = (options: StorageOptions = {}) => {
    return defineMemberDecoratorProcessor('storage', {
        afterInstantiation<T extends Record<MemberKey, unknown>>(
            instance: T,
            member: MemberKey,
            metadata: ClassMetadataReader<T>,
            container: ApplicationContext
        ) {
            const [, set] = getSignal(instance, member);
            const key = options.key ?? member.toString();
            const bucketOrName = options.bucket || DEFAULT_BUCKET;

            const bucket =
                typeof bucketOrName === 'string' ||
                typeof bucketOrName === 'symbol'
                    ? <Bucket>container.getInstance(bucketOrName)
                    : bucketOrName;
            const observe = () => {
                return bucket.observe(key, event => {
                    set(event.newValue);
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
                        bucket.setItem(key, newValue as Data).finally(() => {
                            unobserve = observe();
                        });
                    }
                )
            );
        }
    });
};
