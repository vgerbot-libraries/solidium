export interface DataSerializer {
    serialize(value: unknown): Promise<Blob>;
    deserialize<T>(data: Blob): Promise<T>;
}
