declare function decode(buffer: ArrayLike<number> | BufferSource): unknown;

declare function encode(input: unknown): Uint8Array<ArrayBufferLike>;

export { decode, encode };
