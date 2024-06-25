import {
    isTransformedObject,
    transformerOfObject,
    transformerOfTag
} from '../transformer';
import { ObjectPath } from './ObjectPath';
import { isValidTag } from './Tags';

export class ReviveContext {
    private pathObjectMap = new Map<ObjectPath, unknown>();
    recording(object: unknown, path: ObjectPath) {
        this.pathObjectMap.set(path, object);
    }
    getObject(path: ObjectPath) {
        return this.pathObjectMap.get(path);
    }
    reviverOf(object: unknown) {
        if (isTransformedObject(object) && isValidTag(object.$)) {
            return transformerOfTag(object.$);
        }
        return transformerOfObject(object);
    }
}
