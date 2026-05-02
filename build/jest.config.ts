import path from "node:path";

const packageName = path.basename(process.cwd());
const basedir = `<rootDir>/packages/${packageName}`;

export default {
	transform: {
		"\\.[tj]sx?$": [
			"rollup-jest",
			{
				configFile: path.resolve(__dirname, "../rollup.config.test.js"),
			},
		],
	},
	moduleNameMapper: {
		"^@vgerbot/lazily$":
			"<rootDir>/packages/solidium/node_modules/@vgerbot/lazily/dist/index.esm.js",
	},
	transformIgnorePatterns: [
		"/node_modules/(?!.*@vgerbot[/+]lazily)",
		"/packages/[^/]+/dist/",
		"/packages/[^/]+/lib/",
	],
	testEnvironment: "jsdom",
	testMatch: [
		`${basedir}/__tests__/**/*.spec.ts`,
		`${basedir}/__tests__/**/*.spec.tsx`,
	],
	moduleFileExtensions: ["ts", "js", "tsx"],
	collectCoverage: true,
	collectCoverageFrom: [`${basedir}/src/**/*.ts`],
	coveragePathIgnorePatterns: ["/__tests__/", "/node_modules/"],
	coverageProvider: "v8",
	coverageDirectory: `${basedir}/report/coverage/`,
	coverageReporters: ["json", "html", "text-summary"],
	reporters: [
		"default",
		[
			"jest-html-reporter",
			{
				pageTitle: "Test Report",
				outputPath: "./report/test-report.html",
			},
		],
	],
	setupFiles: ["<rootDir>/__tests__/setup.jest.ts"],
};
