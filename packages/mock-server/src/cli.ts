#!/usr/bin/env node
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { MockServer } from "./index";

// ESM replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * Simple CLI runner for the mock server
 */
const DEFAULT_PORT = 3000;
const DEFAULT_MOCK_DIR = path.join(__dirname, "mocks");

// Parse command line arguments
const args = process.argv.slice(2);
let port = process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT;
let mockDir = process.env.MOCK_DIR || DEFAULT_MOCK_DIR;

// Simple argument parser
for (let i = 0; i < args.length; i++) {
	if (args[i] === "--port" && i + 1 < args.length) {
		port = parseInt(args[i + 1], 10);
		i++;
	} else if (args[i] === "--dir" && i + 1 < args.length) {
		mockDir = args[i + 1];
		i++;
	} else if (args[i] === "--help" || args[i] === "-h") {
		console.log(`
HTTP Mock Server

Usage:
  node cli.js [options]

Options:
  --port <number>   Port to run the server on (default: 3000 or PORT env var)
  --dir <path>      Directory containing mock files (default: ./mocks or MOCK_DIR env var)
  --help, -h        Show this help message
        `);
		process.exit(0);
	}
}

// Create and start server
const server = new MockServer(port);

console.log(`Starting mock server on port ${port}`);
console.log(`Loading mocks from ${mockDir}`);

server.loadMocks(mockDir).then(() => {
	server.start();
});
