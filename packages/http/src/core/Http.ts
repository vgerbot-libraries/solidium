import { Factory, Inject } from "@vgerbot/ioc";
import { Bucket, DEFAULT_BUCKET, Persistence } from "@vgerbot/persistence";
import type { Interceptor, InterceptorTypeIdentifier } from "./Interceptor";

export const DEFAULT_HTTP_CONFIGURATION = Symbol(
	"solidium-default-http-configuration",
);
function keep(...args: unknown[]) {
	return args;
}

export class Http {
	static configure(config: HttpConfiguration) {
		class HttpConfigurationFactory {
			@Inject()
			persistence!: Persistence;
			@Inject(DEFAULT_BUCKET)
			defaultBucket!: Bucket;

			@Factory(DEFAULT_HTTP_CONFIGURATION)
			produce() {
				config.cacheBucket ??= this.defaultBucket.name;
				return config;
			}
		}
		keep(HttpConfigurationFactory);
		return Http;
	}
	init() {}
}
export interface HttpConfiguration {
	cacheBucket?: string;
	interceptors?: Array<InterceptorTypeIdentifier | Interceptor>;
}
