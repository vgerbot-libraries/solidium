import { HttpConfigurationOptions } from '../types/HttpConfiguration';
import { CreateResourceOptions } from '../types/CreateResourceOptions';
import { Resource } from '../types/Resource';
export declare class HttpClient {
    static configure(configuration: HttpConfigurationOptions): typeof HttpClient;
    private configurationOptions;
    private configurers?;
    private appCtx;
    private readonly interceptorRegistry;
    private configuration;
    afterInjected(): void;
    createResource(options: CreateResourceOptions): Resource;
}
