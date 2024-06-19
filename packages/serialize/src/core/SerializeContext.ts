import { ObjectPath } from './ObjectPath';

export class SerializeContext {
    private objectPathMap = new Map<unknown, ObjectPath[]>();
    private pathObjectMap = new Map<ObjectPath, unknown>();
    isHandled(object: unknown) {
        return this.objectPathMap.has(object);
    }
    recording(object: unknown, path: ObjectPath) {
        const paths = this.objectPathMap.get(object) || [];
        paths.push(path);
        this.objectPathMap.set(object, paths);
        this.pathObjectMap.set(path, object);
    }
    getObject(path: ObjectPath) {
        return this.pathObjectMap.get(path);
    }
    isReference(path: ObjectPath) {
        if (!this.pathObjectMap.has(path)) {
            return false;
        }
        const object = this.pathObjectMap.get(path);
        const paths = this.objectPathMap.get(object);
        if (!paths) {
            return false;
        }
        return paths[0] !== path;
    }
}
