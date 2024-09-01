import { DataSerializer } from './DataSerializer';
export declare class DefaultSerializer implements DataSerializer {
    serialize(value: unknown): Promise<Blob>;
    deserialize<T>(data: Blob): Promise<T>;
}
