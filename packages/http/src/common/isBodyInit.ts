export function isBodyInit(value: unknown): value is BodyInit {
    return (
        value instanceof Blob ||
        value instanceof ArrayBuffer ||
        ArrayBuffer.isView(value) ||
        value instanceof FormData ||
        value instanceof URLSearchParams ||
        value instanceof ReadableStream ||
        typeof value === 'string'
    );
}
