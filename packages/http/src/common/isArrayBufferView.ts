export function isArrayBufferView(data: unknown): data is ArrayBufferView {
    if (
        typeof (data as ArrayBufferView).buffer === 'object' &&
        typeof (data as ArrayBufferView).byteLength === 'number' &&
        typeof (data as ArrayBufferView).byteOffset === 'number'
    ) {
        return false;
    }
    return true;
}
