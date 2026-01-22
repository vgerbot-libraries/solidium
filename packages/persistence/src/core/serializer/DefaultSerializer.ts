import { decode, encode } from "@vgerbot/msgpack-ext";
import type { DataSerializer } from "./DataSerializer";

/**
 * Default serializer implementation using MessagePack format.
 * Provides efficient binary serialization for JavaScript values.
 *
 * @public
 */
export class DefaultSerializer implements DataSerializer {
	/**
	 * Serializes a value into a Blob using MessagePack encoding.
	 * @param value - The value to serialize
	 * @returns A promise that resolves to a Blob containing the MessagePack encoded data
	 */
	serialize(value: unknown): Promise<Blob> {
		const u8a = encode(value);
		return Promise.resolve(new Blob([u8a]));
	}
	/**
	 * Deserializes a Blob back into its original value using MessagePack decoding.
	 * @param data - The Blob containing MessagePack encoded data
	 * @returns A promise that resolves to the deserialized value
	 * @typeParam T - The expected type of the deserialized value
	 */
	async deserialize<T>(data: Blob): Promise<T> {
		const buffer = await data.arrayBuffer();
		return decode(buffer) as T;
	}
}
