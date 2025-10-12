import Koa from 'koa';
import Router from 'koa-router';
import { koaBody } from 'koa-body';
import { glob } from 'glob';
import path from 'path';
import chalk from 'chalk';
import cors from '@koa/cors';
class MockServer {
    constructor(port = 3000) {
        this.mockDefinitions = new Map();
        this.app = new Koa();
        this.router = new Router();
        this.port = port;
        // Configure middleware
        this.app.use(koaBody({
            multipart: true,
            formidable: {
                maxFileSize: 200 * 1024 * 1024 // 200MB
            }
        }));
        this.app.use(cors({
            origin(ctx) {
                return ctx.get('Origin') || '*';
            }
        }));
        // Error handling middleware
        this.app.use(async (ctx, next) => {
            try {
                await next();
            }
            catch (err) {
                console.error(chalk.red('Server error:'), err);
                ctx.status = 500;
                let errorMessage = 'Internal Server Error';
                // Type guard for Error objects
                if (err instanceof Error) {
                    errorMessage = err.message;
                }
                // Check for status property on error object
                if (typeof err === 'object' &&
                    err !== null &&
                    'status' in err) {
                    ctx.status = err.status;
                }
                ctx.body = {
                    error: errorMessage
                };
            }
        });
        // Response time middleware
        this.app.use(async (ctx, next) => {
            const start = Date.now();
            await next();
            const ms = Date.now() - start;
            ctx.set('X-Response-Time', `${ms}ms`);
            console.log(chalk.gray(`${ctx.method} ${ctx.url} - ${ms}ms`));
        });
    }
    /**
     * Load all mock files from the specified directory
     */
    async loadMocks(directory) {
        try {
            const mockPattern = path.join(directory, '**/*.mock.{js,ts}');
            const mockFiles = await glob(mockPattern);
            if (mockFiles.length === 0) {
                console.warn(chalk.yellow(`No mock files found in ${directory}`));
                return;
            }
            console.log(chalk.blue(`Loading ${mockFiles.length} mock files...`));
            for (const file of mockFiles) {
                try {
                    // For TypeScript files with ts-node
                    const mockModule = await import(path.resolve(file));
                    // const mockModule = require(path.resolve(file));
                    const mockConfigs = mockModule.default || mockModule;
                    if (!Array.isArray(mockConfigs)) {
                        console.warn(chalk.yellow(`Invalid mock format in ${file} - expected an array of MockConfig objects`));
                        continue;
                    }
                    mockConfigs.forEach(mockConfig => this.registerMock(mockConfig, file));
                }
                catch (err) {
                    console.error(chalk.red(`Failed to load mock file ${file}:`), err);
                }
            }
        }
        catch (err) {
            console.error(chalk.red('Failed to load mock files:'), err);
        }
    }
    /**
     * Register a single mock endpoint
     */
    registerMock(mockConfig, sourceFile) {
        const { method, path: routePath, handler, delay = 0, description } = mockConfig;
        const routeKey = `[${method.toUpperCase()}] ${routePath}`;
        if (this.mockDefinitions.has(routeKey)) {
            console.warn(chalk.yellow(`Warning: Duplicate mock route ${routeKey}`));
        }
        this.mockDefinitions.set(routeKey, mockConfig);
        // Create the route handler with optional delay
        this.router[method](routePath, async (ctx) => {
            if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            await handler(ctx);
        });
        console.log(chalk.green(`Registered: ${routeKey}${description ? ' - ' + description : ''}`));
        if (sourceFile) {
            console.log(chalk.gray(`  Source: ${path.relative(process.cwd(), sourceFile)}`));
        }
    }
    /**
     * Start the mock server
     */
    start() {
        // Use the router middleware
        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());
        // Start the server
        this.app.listen(this.port, () => {
            console.log(chalk.green(`\nMock server is running on http://localhost:${this.port}`));
            console.log(chalk.blue(`Registered ${this.mockDefinitions.size} mock endpoints:\n`));
            // Display all registered routes
            Array.from(this.mockDefinitions.entries()).forEach(([route, config]) => {
                console.log(chalk.cyan(route));
                if (config.description) {
                    console.log(chalk.gray(`  ${config.description}`));
                }
                if (config.delay) {
                    console.log(chalk.yellow(`  Delay: ${config.delay}ms`));
                }
                console.log();
            });
        });
    }
}
// // Create and start the server
// const mockServer = new MockServer();
// const mockDirectory = process.env.MOCK_DIR || path.join(__dirname, 'mocks');
// mockServer.loadMocks(mockDirectory).then(() => {
//     mockServer.start();
// });
export { MockServer };
//# sourceMappingURL=index.js.map