import { Factory } from '@vgerbot/ioc';

export const DEFAULT_HTTP_CONFIGURATION = Symbol(
    'solidium-default-http-configuration'
);
function keep(...args: unknown[]) {
    return args;
}

export class Http {
    static configure(config: HttpConfiguration) {
        class HttpConfigurationFactory {
            @Factory(DEFAULT_HTTP_CONFIGURATION)
            produce() {
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
}
