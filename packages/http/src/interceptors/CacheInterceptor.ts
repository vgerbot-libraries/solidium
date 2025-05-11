import { ApplicationContext, Inject } from '@vgerbot/ioc';
import { Bucket, DEFAULT_BUCKET } from '@vgerbot/solidium-persistence';
import { EndpointInstance } from '../core/EndpointInstance';
import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';
import { DEFAULT_HTTP_CONFIGURATION, HttpConfiguration } from '../core/Http';
import { HttpResponse } from '../core/HttpResponse';
import {
    Interceptor,
    InterceptorConstructor,
    InterceptorNextFunction
} from '../core/Interceptor';
import { RequestMethod } from '../core/RequestMethod';
import { HttpHeaders } from '../http/HttpHeaders';
import { BlobByteStream } from '../http/streams/BlobByteStream';

/**
 * Cache entry structure stored in the bucket
 */
interface CacheEntry {
    /** The cached response data */
    response: {
        status: number;
        headers: Record<string, string[]>;
        body: Uint8Array;
    };
    /** When the entry was cached */
    cachedAt: number;
    /** When the entry expires (based on Cache-Control or config) */
    expiresAt: number;
}
/**
 * The function used to interpret all headers from a request and determine a time to live (ttl) number.
 * The possible returns are:
 * - positive `number`: used as the `ttl` value
 * - negative `number` or 0: the request will not be cached
 * - `null`: Use the default TTL number 300000ms (5 minutes)
 */
export type HeaderInterpreter = (headers: HttpHeaders) => number | null;

export interface CacheInterceptorConfig {
    /**
     * Time-to-live for cached responses in milliseconds or a function to determine TTL.
     *
     * If a number is provided, it sets a fixed TTL for all cached responses.
     * If a function is provided, it allows dynamic TTL calculation based on response headers.
     *
     * @default 300000 (5 minutes)
     */
    ttl?: number | HeaderInterpreter;

    /**
     * Whether to respect Cache-Control headers from the response
     * @default true
     */
    respectCacheControl?: boolean;

    /**
     * Custom function to determine if a request should be cached
     */
    shouldCache?: (
        method: RequestMethod,
        params: ExecuteRequestMethodParams
    ) => boolean;

    /**
     * Custom function to generate a cache key
     */
    generateKey?: (
        method: RequestMethod,
        params: ExecuteRequestMethodParams
    ) => string;

    /**
     * Name of the bucket to use for caching
     * If not provided, uses the default bucket from HttpConfiguration
     */
    bucketName?: string;
}

const DEFAULT_CONFIG: CacheInterceptorConfig = {
    ttl: 5 * 60 * 1000, // 5 minutes
    respectCacheControl: true
};

/**
 * An interceptor that caches HTTP responses and serves them from cache when appropriate.
 *
 * By default, it only caches GET requests and respects Cache-Control headers.
 *
 * @example
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com'
 * })
 * class ExampleAPI {
 *   @Get('/user/:id')
 *   @Cache({
 *     ttl: 60 * 1000,
 *   })
 *   getUser(id: string) {
 *     return restful(id);
 *   }
 * }
 * ```
 */
export class CacheInterceptor implements Interceptor {
    public static createWithConfig(config: CacheInterceptorConfig = {}) {
        class SubCacheInterceptor extends CacheInterceptor {
            constructor() {
                super(config);
            }
        }
        return SubCacheInterceptor as InterceptorConstructor;
    }

    private readonly config: CacheInterceptorConfig;
    private bucket?: Bucket;

    @Inject()
    private appCtx!: ApplicationContext;

    @Inject(DEFAULT_HTTP_CONFIGURATION)
    private httpConfig?: HttpConfiguration;

    protected constructor(config: CacheInterceptorConfig = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    private async getBucket(): Promise<Bucket> {
        if (this.bucket) {
            return this.bucket;
        }

        const bucketName =
            this.config.bucketName ?? this.httpConfig?.cacheBucket;

        if (bucketName) {
            try {
                this.bucket = this.appCtx.getInstance(bucketName) as Bucket;
                return this.bucket;
            } catch {
                // Bucket not found, fall back to default
            }
        }

        this.bucket = this.appCtx.getInstance(DEFAULT_BUCKET) as Bucket;
        return this.bucket;
    }

    private generateCacheKey(
        method: RequestMethod,
        params: ExecuteRequestMethodParams
    ): string {
        if (this.config.generateKey) {
            return this.config.generateKey(method, params);
        }

        // Default cache key generation
        const url = method.resolveURL(params);
        return `http-cache:${url}`;
    }

    private shouldCache(
        method: RequestMethod,
        params: ExecuteRequestMethodParams
    ): boolean {
        if (this.config.shouldCache) {
            return this.config.shouldCache(method, params);
        }

        return true;
    }

    private getExpirationFromHeaders(headers: HttpHeaders): number | null {
        if (!this.config.respectCacheControl) {
            return null;
        }

        const cacheControl = headers.get('cache-control');
        if (!cacheControl) {
            return null;
        }

        // Parse Cache-Control header
        const directives = cacheControl.map(d => d.trim());

        // Check for no-cache or no-store directives
        if (
            directives.includes('no-cache') ||
            directives.includes('no-store')
        ) {
            return 0; // Don't cache
        }

        // Check for max-age directive
        const maxAgeDirective = directives.find(d => d.startsWith('max-age='));
        if (maxAgeDirective) {
            const maxAge = parseInt(maxAgeDirective.split('=')[1], 10);
            if (!isNaN(maxAge)) {
                return Date.now() + maxAge * 1000;
            }
        }

        return null;
    }

    async invoke(
        instance: EndpointInstance,
        method: RequestMethod,
        params: ExecuteRequestMethodParams,
        next: InterceptorNextFunction
    ): Promise<HttpResponse> {
        // Skip caching for non-cacheable methods
        if (!this.shouldCache(method, params)) {
            return next(instance, method, params);
        }

        const cacheKey = this.generateCacheKey(method, params);
        const bucket = await this.getBucket();

        // Try to get from cache
        const cachedEntry = await bucket.getItem<CacheEntry>(cacheKey);

        if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
            // Cache hit and not expired
            const { response } = cachedEntry;

            // Create a response from the cached data
            const headers = new HttpHeaders(response.headers);
            // Create a new HttpResponse from the cached data
            return HttpResponse.of(
                Promise.resolve(new BlobByteStream(new Blob([response.body]))),
                headers,
                response.status,
                method
            );
        }

        // Cache miss or expired, make the actual request
        const response = await next(instance, method, params);

        // Only cache successful responses
        const status = await response.status();
        if (status >= 200 && status < 300) {
            response.onBodyComplete(async body => {
                const headers = await response.headers();
                const bodyArrayBuffer = await body.readAsBuffer();
                // Determine expiration time
                const headerExpiration = this.getExpirationFromHeaders(headers);
                const expiresAt =
                    headerExpiration ??
                    Date.now() +
                        (typeof this.config.ttl === 'number'
                            ? this.config.ttl
                            : (this.config.ttl?.(headers) ?? 0));

                // Don't cache if expiration is 0 (no-cache)
                if (expiresAt > 0) {
                    const cacheEntry: CacheEntry = {
                        response: {
                            status,
                            headers: headers.toJSON(),
                            body: new Uint8Array(bodyArrayBuffer)
                        },
                        cachedAt: Date.now(),
                        expiresAt
                    };

                    // Store in cache
                    await bucket.setItem(cacheKey, cacheEntry);
                }
            });
        }

        return response;
    }
}
