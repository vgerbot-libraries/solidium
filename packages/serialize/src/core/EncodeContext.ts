import { ReferenceTransformer } from '../transformer/ReferanceTransformer';
import { ObjectPath } from './ObjectPath';
import { Transformer } from './Transformer';
import { transformerOfObject } from '../transformer';

export class EncodeContext {
    private objectPathMap = new Map<unknown, ObjectPath[]>();
    private pathObjectMap = new Map<ObjectPath, unknown>();
    private transformerMap = new Map<unknown, Transformer<unknown, unknown>>();
    isHandled(object: unknown) {
        return this.objectPathMap.has(object);
    }
    recording(object: unknown, path: ObjectPath) {
        if (object === null || object === undefined) {
            return;
        }
        switch (typeof object) {
            case 'boolean':
            case 'number':
            case 'string':
                return;
        }
        const paths = this.objectPathMap.get(object) || [];
        paths.push(path);
        this.objectPathMap.set(object, paths);
        this.pathObjectMap.set(path, object);
    }
    getObject(path: ObjectPath) {
        return this.pathObjectMap.get(path);
    }
    getReference(object: unknown) {
        const paths = this.objectPathMap.get(object);
        if (!paths) {
            return;
        }
        return paths[0];
    }
    isReference(object: unknown) {
        return this.getReference(object) !== undefined;
    }
    transformerOf(object: unknown): Transformer<unknown, unknown> {
        if (this.isReference(object)) {
            return new ReferenceTransformer();
        }
        let transformer = this.transformerMap.get(object);
        if (!transformer) {
            transformer = transformerOfObject(object);
        }
        if (!transformer) {
            throw new TypeError(`Cannot serialize value: ${object}`);
        }
        this.transformerMap.set(object, transformer);
        return transformer;
    }
}
