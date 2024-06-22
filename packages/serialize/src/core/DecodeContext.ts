import { transformerOfObject, transformerOfTag } from '../transformer';
import { ObjectPath } from './ObjectPath';
import { Serializable } from './Serializable';
import { isValidTag } from './Tags';

export class DecodeContext {
    private pathObjectMap = new Map<ObjectPath, unknown>();
    recording(object: unknown, path: ObjectPath) {
        this.pathObjectMap.set(path, object);
    }
    getObject(path: ObjectPath) {
        return this.pathObjectMap.get(path);
    }
    transformerOf(object: [number, Serializable] | unknown) {
        if (Array.isArray(object) && isValidTag(object[0])) {
            return transformerOfTag(object[0]);
        }
        return transformerOfObject(object);
    }
}
