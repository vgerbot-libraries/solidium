export async function* chunkIterator(
    readableStream: ReadableStream<Uint8Array>
) {
    const reader = readableStream.getReader();
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            return;
        }
        yield value;
    }
}
