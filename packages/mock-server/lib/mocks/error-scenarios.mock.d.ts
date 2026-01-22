import type { Context } from "koa";
/**
 * Example mock endpoints demonstrating various error scenarios
 */
declare const _default: (
	| {
			method: string;
			path: string;
			description: string;
			handler: (ctx: Context) => void;
			delay?: undefined;
	  }
	| {
			method: string;
			path: string;
			description: string;
			delay: number;
			handler: (ctx: Context) => void;
	  }
)[];
export default _default;
