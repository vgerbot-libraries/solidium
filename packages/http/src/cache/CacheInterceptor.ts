import { ApplicationContext, Inject } from "@vgerbot/ioc";
import { type Bucket, DEFAULT_BUCKET } from "@vgerbot/persistence";
import type { EndpointInstance } from "../core/EndpointInstance";
import type { ExecuteRequestMethodParams } from "../core/ExecuteRequestParams";
import {
	DEFAULT_HTTP_CONFIGURATION,
	type HttpConfiguration,
} from "../core/Http";
import { HttpResponse } from "../core/HttpResponse";
import type {
	Interceptor,
	InterceptorConstructor,
	InterceptorNextFunction,
} from "../core/Interceptor";
import type { RequestMethod } from "../core/RequestMethod";
import { HttpHeaders } from "../http/HttpHeaders";
import { BlobByteStream } from "../http/streams/BlobByteStream";
import type { CacheConfig } from "./CacheConfig";
import type { CacheEntry } from "./CacheEntry";
import { CachePolicies } from "./CachePolicies";
import { DEFAULT_CACHE_CONFIG } from "./constants";

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
 *     Policies.createTimeBasedPolicy(60 * 1000)
 *   })
 *   getUser(id: string) {
 *     return restful(id);
 *   }
 * }
 * ```
 */
export class CacheInterceptor implements Interceptor {
	public static createWithConfig(config: CacheConfig = {}) {
		class SubCacheInterceptor extends CacheInterceptor {
			constructor() {
				super(config);
			}
		}
		return SubCacheInterceptor as InterceptorConstructor;
	}

	private readonly config: CacheConfig;
	private get policy() {
		return this.config.policy ?? CachePolicies.Default;
	}
	private bucket?: Bucket;

	@Inject()
	private appCtx!: ApplicationContext;

	@Inject(DEFAULT_HTTP_CONFIGURATION)
	private httpConfig?: HttpConfiguration;

	protected constructor(config: CacheConfig = {}) {
		this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
	}

	private async getBucket(): Promise<Bucket> {
		if (this.bucket) {
			return this.bucket;
		}

		const bucketName = this.config.bucketName ?? this.httpConfig?.cacheBucket;

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
		params: ExecuteRequestMethodParams,
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
		params: ExecuteRequestMethodParams,
	): boolean {
		if (params.force) {
			return false;
		}
		if (this.config.shouldCache) {
			return this.config.shouldCache(method, params);
		}
		return this.policy.shouldCache(method, params);
	}

	private getExpirationFromHeaders(headers: HttpHeaders): number | null {
		if (!this.config.respectCacheControl) {
			return null;
		}

		const cacheControl = headers.get("cache-control");
		if (!cacheControl) {
			return null;
		}

		// Parse Cache-Control header
		const directives = cacheControl.map((d) => d.trim());

		// Check for no-cache or no-store directives
		if (directives.includes("no-cache") || directives.includes("no-store")) {
			return 0; // Don't cache
		}

		// Check for max-age directive
		const maxAgeDirective = directives.find((d) => d.startsWith("max-age="));
		if (maxAgeDirective) {
			const maxAge = parseInt(maxAgeDirective.split("=")[1], 10);
			if (!Number.isNaN(maxAge)) {
				return Date.now() + maxAge * 1000;
			}
		}

		return null;
	}

	async invoke(
		instance: EndpointInstance,
		method: RequestMethod,
		params: ExecuteRequestMethodParams,
		next: InterceptorNextFunction,
	): Promise<HttpResponse> {
		// Skip caching for non-cacheable methods or when force=true
		if (!this.shouldCache(method, params)) {
			return next(instance, method, params);
		}

		const cacheKey = this.generateCacheKey(method, params);
		const bucket = await this.getBucket();

		// Try to get from cache
		const cachedEntry = await bucket.getItem<CacheEntry>(cacheKey);

		if (cachedEntry && this.policy.isValid(cachedEntry, method, params)) {
			// Cache hit and not expired
			const { response } = cachedEntry;

			// Create a response from the cached data
			const headers = new HttpHeaders(response.headers);
			// Create a new HttpResponse from the cached data
			return HttpResponse.of(
				Promise.resolve(new BlobByteStream(new Blob([response.body]))),
				headers,
				response.status,
				method,
			);
		}

		// Cache miss or expired, make the actual request
		const response = await next(instance, method, params);

		// Only cache successful responses
		const status = await response.status();
		if (status >= 200 && status < 300) {
			response.onBodyComplete(async (body) => {
				const headers = await response.headers();
				const bodyArrayBuffer = await body.readAsBuffer();
				// Determine expiration time
				const headerExpiration = this.getExpirationFromHeaders(headers);
				const ttl = this.policy.getTTL(method, params);
				const expiresAt =
					headerExpiration ?? (ttl === 0 ? 0 : Date.now() + ttl);

				// Don't cache if expiration is 0 (no-cache)
				if (expiresAt > 0) {
					const cacheEntry: CacheEntry = {
						response: {
							status,
							headers: headers.toJSON(),
							body: new Uint8Array(bodyArrayBuffer),
						},
						cachedAt: Date.now(),
						expiresAt,
						metadata: {},
					};

					// use policy to override cache metadata
					const overrideEntry =
						this.policy.overrideCacheEntry?.(cacheEntry, method, params) ??
						cacheEntry;

					// Store in cache
					await bucket.setItem(cacheKey, overrideEntry);
				}
			});
		}

		return response;
	}
}
