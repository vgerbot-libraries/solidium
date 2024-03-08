import { JSONType } from '../types/JSONType';
import { isArrayBufferView } from './isArrayBufferView';
import { isHttpEntity } from './isHttpEntity';

export function isJSON(value: unknown): value is JSONType {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    if (value instanceof ReadableStream) {
        return false;
    }
    if (value instanceof Blob) {
        return false;
    }
    if (value instanceof ArrayBuffer) {
        return false;
    }
    if (value instanceof FormData) {
        return false;
    }
    if (value instanceof URLSearchParams) {
        return false;
    }
    if (isArrayBufferView(value)) {
        return false;
    }
    return !isHttpEntity(value);
}
