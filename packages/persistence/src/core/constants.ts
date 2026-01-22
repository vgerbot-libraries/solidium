/**
 * Symbol identifier for the default bucket configuration in the IoC container.
 * Used internally to register and retrieve the default bucket configuration.
 *
 * @public
 */
export const DEFAULT_BUCKET_CONFIGURATION = Symbol(
    'solidium-default-bucket-configuration'
);

/**
 * Symbol identifier for the default bucket instance in the IoC container.
 * Used internally to register and retrieve the default bucket.
 *
 * @public
 */
export const DEFAULT_BUCKET = Symbol('solidium-default-bucket');
