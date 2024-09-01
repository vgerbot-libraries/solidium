import { MemberKey } from '@vgerbot/ioc';
import { Bucket } from '../core/bucket/Bucket';
export interface StorageOptions {
    bucket?: string | symbol | Bucket;
    key?: string;
}
export declare const Storage: (options?: StorageOptions) => <T extends Record<MemberKey, unknown>>(target: Object, propertyKey: string | symbol) => void;
