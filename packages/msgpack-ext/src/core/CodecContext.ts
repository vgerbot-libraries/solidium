import { ObjectPath } from './ObjectPath';

export abstract class CodecContext {
    protected readonly pathObjectMap = new Map<ObjectPath, unknown>();
    recording(object: unknown, path: ObjectPath): void {
        this.pathObjectMap.set(path, object);
    }
    getObject(path: ObjectPath) {
        return this.pathObjectMap.get(path);
    }
}
