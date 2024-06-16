export interface DataSerializer {
    serialize(value: unknown): Promise<Blob>;
    deserialize(data: Blob): unknown;
}
