import { Factory, Inject, PostInject } from '@vgerbot/ioc';
import { BucketConfiguration } from './bucket/BucketConfiguration';
import { DEFAULT_BUCKET, DEFAULT_BUCKET_CONFIGURATION } from './constants';
import { keep } from '../common/keep';
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
    static default(configuration?: BucketConfiguration) {
        class StorageConfigurationFactory {
            @Factory(DEFAULT_BUCKET_CONFIGURATION)
            getConfiguration() {
                return configuration;
            }
        }
        keep(StorageConfigurationFactory);
        return Persistence;
    }
    static bucket(name: string, configuration: BucketConfiguration) {
        class StorageFactory {
            @Factory(name)
            createStorage() {
                return new Bucket(configuration);
            }
        }
        return StorageFactory;
    }
    @Inject(DEFAULT_BUCKET_CONFIGURATION)
    private configuration: BucketConfiguration = {
        name: 'solidium-persistence',
        version: '1.0'
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
