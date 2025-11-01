declare function encode(input: unknown): Uint8Array<ArrayBufferLike>;

declare function decode(buffer: ArrayLike<number> | BufferSource): unknown;

export { decode, encode };
