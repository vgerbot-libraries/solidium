# HTTP Mock Server

A flexible HTTP mock server built with Koa and glob for testing different HTTP request scenarios.

## Features

- Dynamically loads mock API endpoints from files
- Supports all HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Customizable response delays to simulate network latency
- Comprehensive error simulation
- File upload handling
- Authentication scenarios

## Installation

```bash
# Install dependencies
npm install
```

## Usage

### Starting the server

```bash
# Start the server in development mode (with hot reloading)
npm run dev

# Or start without hot reloading
npm start
```

By default, the server will run on port 3000 and look for mock files in the `src/mocks` directory.

### Custom configuration

You can customize the server port and mock directory using environment variables:

```bash
# Set custom port
PORT=4000 npm run dev

# Set custom mock directory
MOCK_DIR=./custom-mocks npm run dev
```

## Creating Mock Files

Mock files should be placed in the `src/mocks` directory and follow the naming convention `*.mock.ts`.

Each mock file should export an array of mock configurations:

```typescript
import { Context } from 'koa';

export default [
  {
    method: 'get',           // HTTP method (get, post, put, delete, patch)
    path: '/api/endpoint',   // URL path
    description: 'Optional description',
    delay: 1000,             // Optional delay in milliseconds
    handler: (ctx: Context) => {
      // Handle request and set response
      ctx.body = {
        status: 'success',
        data: { ... }
      };
    }
  },
  // More endpoint definitions...
];
```

## Example Endpoints

The server includes several example mock endpoints:

### Basic API operations
- GET `/api/users` - Get list of users
- GET `/api/users/:id` - Get user by ID
- POST `/api/users` - Create new user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Error scenarios
- GET `/api/error/400` - Return 400 Bad Request
- GET `/api/error/401` - Return 401 Unauthorized
- GET `/api/error/403` - Return 403 Forbidden
- GET `/api/error/404` - Return 404 Not Found
- GET `/api/error/429` - Return 429 Too Many Requests
- GET `/api/error/500` - Return 500 Internal Server Error
- GET `/api/error/503` - Return 503 Service Unavailable
- GET `/api/error/timeout` - Simulate timeout (10s delay)
- GET `/api/error/malformed-json` - Return malformed JSON

### File uploads
- POST `/api/upload/single` - Upload single file
- POST `/api/upload/multiple` - Upload multiple files 
- POST `/api/upload/with-metadata` - Upload file with metadata

### Authentication
- POST `/api/auth/login` - Login with username/password
- POST `/api/auth/token` - Refresh access token
- POST `/api/auth/logout` - Logout
- GET `/api/auth/profile` - Get user profile (protected route)

## Testing the Endpoints

You can test the endpoints using tools like curl, Postman, or any HTTP client:

```bash
# Example: Get list of users
curl http://localhost:3000/api/users

# Example: Create a new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"new@example.com"}'

# Example: Upload a file
curl -X POST http://localhost:3000/api/upload/single \
  -F "file=@./path/to/file.jpg"

# Example: Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
