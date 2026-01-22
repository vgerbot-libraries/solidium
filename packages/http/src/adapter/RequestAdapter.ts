import type { HttpSource } from "../http/HttpSource";
import type { AdapterOptions } from "./AdapterOptions";

export interface RequestAdapter {
	abort(): void;

	execute(): Promise<HttpSource>;
}
export type RequestAdapterConstructor = new (
	options: AdapterOptions,
) => RequestAdapter;
