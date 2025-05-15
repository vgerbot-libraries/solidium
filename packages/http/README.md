# Solidium-Http

A comprehensive HTTP client for Solidium applications with support for:

- Declarative API definitions with decorators
- Interceptors for request/response processing
- Advanced caching with policy-based management
- SWR (stale-while-revalidate) pattern
- Progress tracking for uploads and downloads
- Error handling and retry mechanisms

## Features

### Declarative APIs

Define your API endpoints using decorators:

```typescript
@Endpoint({
    baseURL: 'https://api.example.com'
})
class UserAPI {
    @Get('/users/{id}')
    getUser(@PathVariable('id') id: number) {
        return restful<User>();
    }

    @Post('/users')
    createUser(@Payload() user: User) {
        return restful<User>();
    }
}
```

### Advanced Caching

The library includes a comprehensive cache management system:

- Policy-based caching
- Cache statistics tracking
- Tag-based invalidation
- Multiple storage backends
- Automatic cache control

```typescript
@Get('/users/{id}')
@EnhancedCache({
    policy: CachePolicies.createTimeBasedPolicy(60000),
    tags: ['users']
})
getUser(@PathVariable('id') id: number) {
    return restful<User>();
}
```

See the [Cache Management System](./src/cache/README.md) documentation for more details.

### SWR Pattern

Support for the stale-while-revalidate pattern:

```typescript
@Get('/users/{id}')
@SWR({
    refresh: { interval: 30000 }
})
getUser(@PathVariable('id') id: number) {
    return restful<User>();
}
```

### Interceptors

Customize request/response handling with interceptors:

- Retry
- Circuit Breaker
- Timeout
- Caching
- Error Context

### Progress Tracking

Track progress for uploads and downloads:

```typescript
const resource = api.downloadFile();
resource.subscribe(state => {
    console.log(`Progress: ${state.progress.percentage}%`);
});
```
