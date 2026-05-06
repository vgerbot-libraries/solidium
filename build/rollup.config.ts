import fs from "node:fs";
import path from "node:path";
import alias from "@rollup/plugin-alias";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import html, { makeHtmlAttributes } from "@rollup/plugin-html";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import serve from "@rollup-extras/plugin-serve";
import type {
	OutputOptions,
	Plugin,
	PluginContext,
	RollupOptions,
} from "rollup";
import del from "rollup-plugin-delete";
import dts from "rollup-plugin-dts";
import hmr from "rollup-plugin-hot";
import tsconfigPaths from "rollup-plugin-tsconfig-paths";
import typescript from "rollup-plugin-typescript2";

const pkg = require(path.resolve(process.cwd(), "package.json"));

const inputFile = path.resolve(process.cwd(), "src/index.ts");

const isExample = pkg.name.indexOf("examples") > -1;

const isServingExamples =
	process.env.NODE_ENV === "development" && pkg.name.indexOf("examples") > -1;

const outputConfig = [
	[pkg.browser, "umd"],
	[pkg.module, "es"],
	[pkg.main, "cjs"],
]
	.filter((it) => !!it[0])
	.map((confs) => createOutputConfig(confs[0], confs[1]));

const extensions = [".ts", ".tsx", ".js", ".jsx"];

// Main bundle configuration
const mainConfig: RollupOptions[] = outputConfig.map((output, index) => {
	return {
		output: output,
		input: inputFile,
		watch: isServingExamples
			? {
					chokidar: {
						ignored: /node_modules\/(?!@vgerbot[/\\]).*/,
					},
				}
			: false,
		plugins: [
			index === 0 && del({ targets: "lib/*" }),
			tsconfigPaths(),
			nodeResolve({
				mainFields: ["module", "browser", "main"],
				extensions,
			}),
			commonjs({
				include: "node_modules/**",
				ignore: [],
				sourceMap: false,
				extensions,
			}),
			typescript({
				exclude: "node_modules/**",
				tsconfig: path.resolve(process.cwd(), "tsconfig.json"),
				tsconfigOverride: {
					compilerOptions: {
						target: isServingExamples
							? "esnext"
							: output.format === "es"
								? "es6"
								: "es5",
						downlevelIteration: true,
					},
				},
				useTsconfigDeclarationDir: true,
			}),
			babel({
				extensions,
				babelHelpers: "bundled",
				presets: ["solid", "@babel/preset-typescript"],
				exclude: /node_modules\//,
				plugins: [
					[
						"@babel/plugin-proposal-decorators",
						{
							legacy: true,
						},
					],
				],
			}),
			isServingExamples &&
				html({
					template: async ({
						attributes,
						files,
						meta,
						publicPath,
						title,
						addScriptsToHead,
					}) => {
						// Only directly <script>-load entry chunks; others are loaded indirectly
						let scripts = (files.js || [])
							.filter((file) => file.type === "chunk" && file.isEntry)
							.map((file) => {
								const attrs = makeHtmlAttributes(attributes.script);
								return `<script src="${publicPath}${file.fileName}"${attrs}></script>`;
							})
							.join("\n");
						let links = (files.css || [])
							.map(({ fileName }) => {
								const attrs = makeHtmlAttributes(attributes.link);
								return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
							})
							.concat(
								`<link
                                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" 
                                    rel="stylesheet" 
                                    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
                                    crossorigin="anonymous"
                                >`,
							)
							.join("\n");
						if (addScriptsToHead === true) {
							links += scripts;
							scripts = "";
						}
						const metas = meta
							.map((input) => {
								const attrs = makeHtmlAttributes(input);
								return `<meta${attrs}>`;
							})
							.join("\n");
						return `
                <!doctype html>
                <html${makeHtmlAttributes(attributes.html)}>
                  <head>
                    ${metas}
                    <title>${title}</title>
                    ${links}
                  </head>
                  <body>
                    ${scripts}
                  </body>
                </html>`;
					},
				}),
			isServingExamples &&
				serve({
					port: Number(process.env.SERVE_PORT),
					dirs: "dist",
				}),
			isServingExamples && hmr({}),
			isExample &&
				alias({
					entries: [
						{
							find: "@vgerbot/solidium",
							replacement: path.resolve(
								process.cwd(),
								"../../solidium/src/index.ts",
							),
						},
						{
							find: "@vgerbot/solidium-http",
							replacement: path.resolve(
								process.cwd(),
								"../../http/src/index.ts",
							),
						},
						{
							find: "@vgerbot/solidium-persistence",
							replacement: path.resolve(
								process.cwd(),
								"../../persistence/src/index.ts",
							),
						},
						{
							find: "@vgerbot/msgpack-ext",
							replacement: path.resolve(
								process.cwd(),
								"../../msgpack-ext/src/index.ts",
							),
						},
					],
				}),
		].filter(Boolean),
		external: isExample ? [] : /node_modules|@vgerbot[\\/]/,
	} as RollupOptions;
});

function createOutputConfig(
	file: string,
	format: string,
	cfg: OutputOptions = {},
): OutputOptions {
	return Object.assign(
		{
			file: path.resolve(process.cwd(), file),
			format,
			sourcemap: true,
			name: pkg.library,
			globals: {
				"@msgpack/msgpack": "MessagePack",
				"is-plain-object": "isPlainObject",
				"@vgerbot/ioc": "IOC",
				"@vgerbot/solidium": "Solidium",
				"@vgerbot/solidium-persistence": "Persistence",
				"@vgerbot/solidium-http": "SolidiumHttp",
				"@vgerbot/msgpack-ext": "MPext",
			},
			exports: "named",
		},
		cfg || {},
	);
}

const dtsconfig = {
	input: "lib/typings/index.d.ts",
	output: {
		file: "lib/index.d.ts",
		format: "es",
	},
	plugins: [
		dts(),
		{
			name: "cleanup-dts",
			buildEnd: function (this: PluginContext) {
				const inputDir = path.resolve(process.cwd(), "lib/typings");
				fs.rmdir(inputDir, { recursive: true }, (err) => {
					if (err) {
						console.error("Failed to remove typings directory: ", err);
					}
				});
			},
		} satisfies Plugin,
	],
} satisfies RollupOptions;

export default mainConfig.concat(isExample ? [] : [dtsconfig]);
