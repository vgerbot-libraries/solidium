export function createBlob(parts: BlobPart[], options: BlobPropertyBag) {
    return new Blob(parts, options);
}
export function createPlainTextBlob(...parts: string[]) {
    return createBlob(parts, { type: 'text/plain' });
}
