import fs from "node:fs";
import { resolve } from "node:path";
import swc from "unplugin-swc";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

// Custom plugin to copy MSW service worker to public directory
function copyMSWServiceWorker() {
	return {
		name: "copy-msw-service-worker",
		buildStart() {
			const publicDir = resolve("public");
			if (!fs.existsSync(publicDir)) {
				fs.mkdirSync(publicDir, { recursive: true });
			}

			const srcPath = resolve("node_modules/msw/lib/mockServiceWorker.js");
			const destPath = resolve("public/mockServiceWorker.js");

			if (fs.existsSync(srcPath)) {
				fs.copyFileSync(srcPath, destPath);
				console.log("MSW Service Worker copied to public directory");
			} else {
				console.error("MSW Service Worker not found at", srcPath);
			}
		},
	};
}

export default defineConfig({
	plugins: [
		solidPlugin(),
		copyMSWServiceWorker(),
		swc.vite({
			tsconfigFile: "./tsconfig.json",
			jsc: {
				parser: {
					syntax: "typescript",
					decorators: true,
				},
				transform: {
					decoratorMetadata: true,
				},
			},
		}),
	],
	server: {
		port: 3000,
		fs: {
			// Allow serving files from node_modules
			allow: [".."],
		},
	},
	publicDir: "public",
});
