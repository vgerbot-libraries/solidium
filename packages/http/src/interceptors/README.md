# HTTP Interceptors

This directory contains various interceptors that can be used to modify HTTP requests and responses.

## Available Interceptors

### Cache

The `Cache` decorator provides HTTP response caching functionality. It stores responses in a bucket and serves them from cache when appropriate.

#### Features

- Respects Cache-Control headers
- Configurable TTL (time-to-live)
- Custom cache key generation
- Integration with Solidium persistence layer

#### Usage

```typescript
import { Endpoint, Get, restful, Cache } from '@vgerbot/http';

@Endpoint({
    baseURL: 'https://api.example.com'
})
class ExampleAPI {
    @Get('/users/{id}')
    @Cache({
        ttl: 60 * 1000, // 1 minute cache
        respectCacheControl: true,
    })
    getUser(id: number) {
        return restful<User>();
    }
}
```

#### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ttl` | `number\|HeaderInterpreter` | `300000` (5 minutes) | Default time-to-live for cached responses in milliseconds |
| `respectCacheControl` | `boolean` | `true` | Whether to respect Cache-Control headers from the response |
| `cacheMethods` | `HttpMethod[]` | `[HttpMethod.GET]` | HTTP methods that can be cached |
| `shouldCache` | `Function` | - | Custom function to determine if a request should be cached |
| `cacheKeyGenerator` | `Function` | - | Custom function to generate a cache key |
| `bucketName` | `string` | - | Name of the bucket to use for caching |

### TimeoutInterceptor

The `TimeoutInterceptor` adds timeout functionality to HTTP requests.

### RetryInterceptor

The `RetryInterceptor` automatically retries failed HTTP requests with exponential backoff.

### CircuitBreakerInterceptor

The `CircuitBreakerInterceptor` implements the circuit breaker pattern to prevent cascading failures.

### ErrorContextInterceptor

The `ErrorContextInterceptor` enhances error objects with request context information.

## Creating Custom Interceptors

You can create custom interceptors by implementing the `Interceptor` interface:

```typescript
import { Interceptor, InterceptorNextFunction } from '@vgerbot/http';

export class MyCustomInterceptor implements Interceptor {
    async invoke(
        instance: EndpointInstance,
        method: RequestMethod,
        params: ExecuteRequestMethodParams,
        next: InterceptorNextFunction
    ): Promise<HttpResponse> {
        // Do something before the request
        
        // Call the next interceptor in the chain
        const response = await next(instance, method, params);
        
        // Do something with the response
        
        return response;
    }
}
```
