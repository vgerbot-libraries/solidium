import { BucketConfiguration } from './bucket/BucketConfiguration';
import { Bucket } from './bucket/Bucket';
/**
 * ```jsx
 * <Solidium autoRegisterClasses={[
    Persistence.default({
        // default storage configuration
    }),
    Persistence.bucket(
        'custom-bucket-name',
        {
            // custom storage configuration
        }
    )
 ]}></Solidium>
 * ```
 *
 * ```js
 class BizService {
    @Signal()
    @Storage() // use default storage
    autoSaveToDefaultStorage: boolean;
    @Signal()
    @Storage({
        bucket: 'custom-bucket-name'
    }) //
    autoSaveToCustomStorage: boolean;
 }
 * ```
 */
export declare class Persistence {
    static default(configuration?: BucketConfiguration): typeof Persistence;
    static bucket(name: string, configuration: BucketConfiguration): {
        new (): {
            createStorage(): Bucket;
        };
    };
    private configuration;
    getDefaultBucket(): Bucket;
    init(): void;
}
