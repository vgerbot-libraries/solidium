import { defineMemberDecoratorProcessor, getSignal } from '@vgerbot/solidium';
import { createEffect, getOwner, on, runWithOwner } from 'solid-js';
import {
    ApplicationContext,
    ClassMetadataReader,
    MemberKey
} from '@vgerbot/ioc';
import { Data } from '../types/Data';
import { Bucket } from '../core/bucket/Bucket';
import { DEFAULT_BUCKET } from '../core/constants';
import { notifyStorageLoad } from './OnStorageLoad';
import { ActionType } from '../types/ActionType';
import { ChangeBy } from '../types/ChangeBy';

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
                typeof bucketOrName != 'object'
                    ? <Bucket>container.getInstance(bucketOrName)
                    : bucketOrName;
            const observe = () => {
                return bucket.observe(key, event => {
                    if (bucket.debug) {
                        console.debug(
                            `[Storage] ${ActionType[event.action]} ${JSON.stringify(
                                {
                                    action: ActionType[event.action],
                                    changeBy: ChangeBy[event.changeBy],
                                    key: event.key,
                                    bucketName: event.target.name,
                                    newValue: event.newValue,
                                    originValue: event.originValue
                                }
                            )}`
                        );
                    }
                    set(event.newValue);
                });
            };
            if (bucket.debug) {
                console.debug(`[Storage] ${key} is loaded from ${bucket.name}`);
            }
            const owner = getOwner();
            bucket.getItem(key).then(value => {
                if (bucket.debug) {
                    console.debug(
                        `[Storage] ${key} is loaded, value: ${value}`
                    );
                }
                set(value);
                notifyStorageLoad({
                    instance,
                    member,
                    value,
                    timestamp: Date.now()
                });
                runWithOwner(owner, () => {
                    let unobserve = observe();
                    createEffect(
                        on(
                            () => {
                                return instance[member];
                            },
                            newValue => {
                                unobserve();
                                if (bucket.debug) {
                                    console.debug(
                                        `[Storage] ${instance.constructor.name}.${member.toString()} 
                                        changed to ${newValue}`.replace(
                                            /\s+/g,
                                            ' '
                                        )
                                    );
                                }
                                bucket
                                    .setItem(key, newValue as Data)
                                    .finally(() => {
                                        unobserve = observe();
                                    });
                            }
                        )
                    );
                });
            });
        }
    });
};
