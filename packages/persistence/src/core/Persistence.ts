import {
    Factory,
    Inject,
    PostInject,
    createFactoryWrapper
} from '@vgerbot/ioc';
import { BucketConfiguration } from './bucket/BucketConfiguration';
import { DEFAULT_BUCKET, DEFAULT_BUCKET_CONFIGURATION } from './constants';
import { Bucket } from './bucket/Bucket';
import { lazy } from '../common/lazy.decorator';
/**
 * Main entry point for the persistence system.
 * Provides factory methods for configuring storage buckets.
 *
 * @example
 * Configure default and custom buckets in your Solidium application:
 * ```tsx
 * <Solidium autoRegisterClasses={[
 *   Persistence.default({
 *     driver: DefaultDrivers.LOCAL_STORAGE,
 *     debug: true
 *   }),
 *   Persistence.bucket('custom-bucket-name', {
 *     name: 'custom-bucket-name',
 *     driver: DefaultDrivers.INDEXED_DB,
 *     version: 1.0
 *   })
 * ]}></Solidium>
 * ```
 *
 * @example
 * Use storage decorators in your services:
 * ```typescript
 * class BizService {
 *   @Signal()
 *   @Storage() // uses default bucket
 *   autoSaveToDefaultStorage: boolean;
 *
 *   @Signal()
 *   @Storage({
 *     bucket: 'custom-bucket-name'
 *   })
 *   autoSaveToCustomStorage: boolean;
 * }
 * ```
 *
 * @public
 */
export class Persistence {
    /**
     * Creates a factory wrapper for the default storage bucket configuration.
     * The default bucket is used when no bucket is specified in `@Storage()` decorators.
     *
     * @param configuration - Configuration options for the default bucket (name is automatically set)
     * @returns A factory wrapper that can be registered with Solidium
     *
     * @example
     * ```typescript
     * Persistence.default({
     *   driver: DefaultDrivers.LOCAL_STORAGE,
     *   debug: true
     * })
     * ```
     */
    static default(
        configuration?: Omit<BucketConfiguration, 'name'>
    ): typeof Persistence {
        return createFactoryWrapper(
            DEFAULT_BUCKET_CONFIGURATION,
            configuration,
            Persistence
        );
    }
    /**
     * Creates a factory wrapper for a custom named storage bucket.
     * Named buckets can be referenced in `@Storage()` decorators by their name.
     *
     * @param name - The name identifier for this bucket
     * @param configuration - Configuration options for the bucket
     * @returns A factory wrapper that can be registered with Solidium
     *
     * @example
     * ```typescript
     * Persistence.bucket('user-preferences', {
     *   name: 'user-preferences',
     *   driver: DefaultDrivers.INDEXED_DB,
     *   version: 1.0
     * })
     * ```
     */
    static bucket(
        name: string,
        configuration: BucketConfiguration
    ): typeof Persistence {
        return createFactoryWrapper(name, configuration, Persistence);
    }
    @Inject(DEFAULT_BUCKET_CONFIGURATION)
    private configuration: BucketConfiguration = {
        name: 'solidium-persistence',
        version: 1.0
    };

    @lazy()
    get defaultBucket() {
        return new Bucket(this.configuration);
    }

    /**
     * Factory method that creates and returns the default bucket instance.
     * @internal
     */
    @Factory(DEFAULT_BUCKET)
    getDefaultBucket() {
        return this.defaultBucket;
    }

    /**
     * Initialization hook called after dependency injection.
     * @internal
     */
    @PostInject()
    init() {
        //
    }
}
