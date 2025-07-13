import {
    Factory,
    Inject,
    PostInject,
    createFactoryWrapper
} from '@vgerbot/ioc';
import { BucketConfiguration } from './bucket/BucketConfiguration';
import { DEFAULT_BUCKET, DEFAULT_BUCKET_CONFIGURATION } from './constants';
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
export class Persistence {
    static default(configuration?: Omit<BucketConfiguration, 'name'>) {
        return createFactoryWrapper(
            DEFAULT_BUCKET_CONFIGURATION,
            configuration,
            Persistence
        );
    }
    static bucket(name: string, configuration: BucketConfiguration) {
        return createFactoryWrapper(name, configuration, Persistence);
    }
    @Inject(DEFAULT_BUCKET_CONFIGURATION)
    private configuration: BucketConfiguration = {
        name: 'solidium-persistence',
        version: 1.0
    };

    @Factory(DEFAULT_BUCKET)
    getDefaultBucket() {
        return new Bucket(this.configuration);
    }

    @PostInject()
    init() {
        //
    }
}
