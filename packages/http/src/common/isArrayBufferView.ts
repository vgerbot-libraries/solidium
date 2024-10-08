export function isArrayBufferView(data: unknown): data is ArrayBufferView {
    if (
        data !== null &&
        typeof data === 'object' &&
        hasObjectProperty(data, 'buffer') &&
        hasNumberProperty(data, 'byteLength') &&
        hasNumberProperty(data, 'byteOffset')
    ) {
        return false;
    }
    return true;
}
function hasObjectProperty(target: object, name: string) {
    const value = (target as Record<string, unknown>)[name];
    return name in target && value !== null && typeof value === 'object';
}
function hasNumberProperty(target: object, name: string) {
    const value = (target as Record<string, unknown>)[name];
    return name in target && value !== null && typeof value === 'number';
}
