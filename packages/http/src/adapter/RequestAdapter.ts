import { HttpSource } from '../http/HttpSource';
import { AdapterOptions } from './AdapterOptions';

export interface RequestAdapter {
    abort(): void;

    execute(): Promise<HttpSource>;
}
export type RequestAdapterConstructor = new (
    options: AdapterOptions
) => RequestAdapter;
