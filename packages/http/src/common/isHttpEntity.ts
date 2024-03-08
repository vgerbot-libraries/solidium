import { HttpEntity } from '../types/HttpEntity';

export function isHttpEntity(value: unknown): value is HttpEntity {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    if (typeof (value as HttpEntity).contentType !== 'function') {
        return false;
    }
    if (typeof (value as HttpEntity).data !== 'function') {
        return false;
    }
    if (typeof (value as HttpEntity).size !== 'function') {
        return false;
    }
    return true;
}
