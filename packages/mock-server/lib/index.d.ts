import Koa from "koa";
interface MockConfig {
	method: "get" | "post" | "put" | "delete" | "patch";
	path: string;
	handler: (ctx: Koa.Context) => void | Promise<void>;
	delay?: number;
	description?: string;
}
declare class MockServer {
	private app;
	private router;
	private port;
	private mockDefinitions;
	constructor(port?: number);
	/**
	 * Load all mock files from the specified directory
	 */
	loadMocks(directory: string): Promise<void>;
	/**
	 * Register a single mock endpoint
	 */
	registerMock(mockConfig: MockConfig, sourceFile?: string): void;
	/**
	 * Start the mock server
	 */
	start(): void;
}
export { MockServer };
