/**
 * Interface for serializing and deserializing data for storage.
 * Custom implementations can be provided to support different serialization formats.
 *
 * @public
 */
export interface DataSerializer {
    /**
     * Serializes a value into a Blob for storage.
     * @param value - The value to serialize
     * @returns A promise that resolves to a Blob containing the serialized data
     */
    serialize(value: unknown): Promise<Blob>;
    /**
     * Deserializes a Blob back into its original value.
     * @param data - The Blob containing serialized data
     * @returns A promise that resolves to the deserialized value
     * @typeParam T - The expected type of the deserialized value
     */
    deserialize<T>(data: Blob): Promise<T>;
}
