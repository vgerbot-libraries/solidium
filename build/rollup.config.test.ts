import path from "node:path";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import type { RollupOptions } from "rollup";
import typescript from "rollup-plugin-typescript2";

const rollupConfig: RollupOptions = {
	output: {
		sourcemap: true,
	},
	plugins: [
		nodeResolve({
			mainFields: ["module", "browser", "main"],
		}),
		commonjs({
			include: "node_modules/**",
			ignore: [],
			sourceMap: false,
		}),
		typescript({
			tsconfig: "__tests__/tsconfig.json",
			tsconfigOverride: {
				compilerOptions: {
					baseUrl: path.resolve(process.cwd(), "__tests__"),
					paths: {
						"@src/*": ["../src/*"],
					},
				},
			},
		}),
	],
};
export default rollupConfig;
